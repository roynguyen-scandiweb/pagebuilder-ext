import domToReact from 'html-react-parser/lib/dom-to-react';
import {isNotEmptyArr, makeId} from '../helper/functions';
import Tab from '../component/Tab';
import Buttons from '../component/Buttons';
import Slider from '../component/Slider';
import GoogleMap from '../component/GoogleMap';
import DynamicBlock from '../component/DynamicBlock';
import Dotdigital from '../component/DotdigitalForm';
import HtmlCode from '../component/HtmlCode';
import {GOOGLE_MAP_SKELETON} from '../component/GoogleMap/GoogleMap.config';
import {BUTTONS_SKELETON} from '../component/Buttons/Buttons.config';
import {SLIDER_SKELETON} from '../component/Slider/Slider.config';
import {DYNAMIC_BLOCK_SKELETON} from '../component/DynamicBlock/DynamicBlock.config';
import {DOTDIGITAL_FORM_SKELETON} from '../component/DotdigitalForm/Dotdigital.config';
import {TAB_SKELETON} from '../component/Tab/Tab.config';
import {HTML_CODE_SKELETON} from '../component/HtmlCode/HtmlCode.config';

function decodeUrl(value) {
  let result = "";
  value = decodeURIComponent((value).replace(window.location.href, ""));
  const regexp = /{{.*\s*url="?(.*\.([a-z|A-Z]*))"?\s*}}/;
  if (regexp.test(value)) {
    const [, url] = regexp.exec(value);
    result = 'media/' + url
  }
  return result;
}


export class HtmlComponentPlugin {
  originalMember;
  baseInstance;
  parserOptions;
  rules = [
    { query: { dataContentType: 'buttons' }, replace: this.replaceButtons },
    { query: { dataContentType: 'tabs' }, replace: this.replaceTab },
    { query: { dataContentType: 'slider' }, replace: this.replaceSlider },
    { query: { dataContentType: 'map' }, replace: this.replaceMap },
    { query: { dataContentType: 'dynamic_block' }, replace: this.replaceDynamicBlock },
    { query: { dataContentType: 'dotdigitalgroup_form' }, replace: this.replaceDotdigitalForm },
    { query: { dataContentType: 'html' }, replace: this.replaceHtmlCode }
  ]

  overrideRules = (originalMember, instance) => {
    // We filter out img tag and implement it separately
    // because its behaviour is different from usual in page-builder
    return originalMember.filter(i => !(i.query && i.query.name && i.query.name[0] === 'img'))
  }

  // Override parserOptions:
  // - Add our rules which is based on data-content-type attr
  // - Process special attr such as: data-background-images
  getParserOptions = (originalMember, instance) => {
    this.originalMember = originalMember
    this.baseInstance = instance
    const replace = (domNode) => {
      if (domNode.data && !domNode.data.replace(/\u21b5/g, '').replace(/\s/g, '').length) {
        return <></>;
      }
      this.replaceSpecialDomAttrs(domNode)

      const { attribs: domAttrs } = domNode;

      const rule = this.rules.find((rule) => {
        const { query: { dataContentType } } = rule;
        if (dataContentType && domAttrs && domAttrs['data-content-type'] === dataContentType) {
          return true
        }
      })
      if (rule) {
        const { replace } = rule;
        return replace.call(this, domNode);
      }
      return this.originalMember.replace(domNode)
    }
    this.parserOptions = {
      ...this.originalMember,
      replace,
      trim: true
    }
    return this.parserOptions
  };

  replaceSpecialDomAttrs(domNode) {
    const { attribs: domAttrs } = domNode;
    if (!domAttrs || Object.keys(domAttrs).length === 0) {
      return;
    }
    if (domAttrs['data-background-images']) {
      this.handleDynamicBackgroundImages(domAttrs, domNode);
    }
  }

  // Magento page-builder is using the below objects:
  // {"desktop_image": "http://host/media/wysiwyg/background.jpg", "mobile_image": "http://host/media/wysiwyg/banner-1.jpg"}
  // OR {"desktop_image": "{{media url=wysiwyg/wide-banner-background.jpg}}"}
  // to generate 2 unique classnames for desktop & mobile.
  // Let just generate 1 unique classname and use media-query for mobile
  handleDynamicBackgroundImages(domAttrs, domNode) {
    try {
      const images = JSON.parse(domAttrs['data-background-images'].replace(/\\(.)/mg, "$1")) || {};

      let uniqClassName = 'bg-image-' + makeId(5)
      let css = ''
      if (images.desktop_image) {
        // Sometimes magento returns an stringify object instead of a string. We need to decode to a URL string
        const imageUrl = decodeUrl(images.desktop_image) || images.desktop_image
        css += `
          .${uniqClassName} {
            background-image: url(${imageUrl});
          }`
      }
      if (images.mobile_image) {
        const imageUrl = decodeUrl(images.mobile_image) || images.mobile_image
        css += `
            @media only screen and (max-width: 810px) {
              .${uniqClassName} {
                background-image: url(${imageUrl});
              }
            }
          `
      }
      // Let's add it to our <head /> tag
      if (css) {
        const head = document.head
        const style = document.createElement('style');
        head.appendChild(style);
        style.type = 'text/css';
        if (style.styleSheet) {
          // This is required for IE8 and below.
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        domNode.attribs.class = `${domNode.attribs.class || ''} ${uniqClassName}`
      }
    } catch (e) {
      // Just forget it
      console.log(e)
    }
  }

  // options obj: {isInLoop: boolean, allowedTypes: ('tag'|'script'|'style')[]}.
  // The idea is:
  // - For individual element, we create a React Element and store all of its props.
  // - For in-loop elements (data.map(() => <div />). We create just the first element
  // then store all of its sibling's props to a bag.
  // The result is we will have the same HTML structure in React Element. So that we can
  // use React to manipulate these elements freely
  toReactElements(domNodes, skeleton, options = {}, res = {}) {
    const {
      isInLoop = false,
      // Sometimes, page-builder html code contains un-sanitize chars from script or style tags,
      // which makes our parser run incorrectly.
      // Most of the time, we don't need them so that we limit to "tag" by default
      allowedTypes = ['tag']
    } = options
    let skeletonIdx = 0 // Index to help mapping current domNode with our skeleton config
    domNodes.forEach((domNode) => {
      if (allowedTypes.indexOf(domNode.type) === -1) {
        return;
      }
      // Begin
      this.replaceSpecialDomAttrs(domNode)

      let childData = null
      let childEle = null
      const config = skeleton[skeletonIdx] || skeleton[0]
      skeletonIdx += 1

      const orgProps = this.baseInstance.attributesToProps(domNode.attribs || {});

      // Create element if not existed
      if (!res[config.name]) {
        const element = React.forwardRef(({ children, ...rest }, ref) => {
          return React.createElement(domNode.name, { ...(!isInLoop && orgProps), ...rest, ref }, children);
        })
        res[config.name] = { Ele: element, propsBag: [], childData: [], childEleBag: [] }
      }

      // Generate all children nodes if our skeleton reached the end
      // in order to render these children nodes later on
      if (!config.children && domNode.children) {
        childEle = domToReact(domNode.children, this.parserOptions)
      }

      if ((isInLoop || config.isLoopParent) && isNotEmptyArr(domNode.children)) {
        childData = domNode.children.map(i => i.data)
      }

      res[config.name] = {
        ...res[config.name],
        propsBag: [...res[config.name].propsBag, orgProps],
        childEleBag: [...res[config.name].childEleBag, childEle],
        childData: [...res[config.name].childData, ...(childData || [])]
      }

      if (domNode.children && config.children) {
        const childRes = this.toReactElements(domNode.children, config.children, {
          isInLoop: (isInLoop || config.isLoopParent),
          allowedTypes
        }, res)
        res = { ...res, ...childRes }
      }
    })
    return res
  }

  replaceTab(domNode) {
    return <Tab elements={this.toReactElements([domNode], TAB_SKELETON)} />
  };

  replaceSlider(domNode) {
    return <Slider elements={this.toReactElements([domNode], SLIDER_SKELETON)} />
  };

  replaceMap(domNode) {
    return <GoogleMap elements={this.toReactElements([domNode], GOOGLE_MAP_SKELETON)} />
  };

  replaceDynamicBlock(domNode) {
    return <DynamicBlock elements={this.toReactElements([domNode], DYNAMIC_BLOCK_SKELETON)} />
  };

  replaceDotdigitalForm(domNode) {
    return <Dotdigital
      elements={this.toReactElements([domNode], DOTDIGITAL_FORM_SKELETON, { allowedTypes: ['tag', 'script'] })} />
  };

  replaceHtmlCode(domNode) {
    return <HtmlCode
      elements={this.toReactElements([domNode], HTML_CODE_SKELETON, { allowedTypes: ['tag', 'script'] })} />
  };

  replaceButtons(domNode) {
    return <Buttons elements={this.toReactElements([domNode], BUTTONS_SKELETON)} />
  };

}

const { getParserOptions, overrideRules } = new HtmlComponentPlugin()
export default {
  "Component/Html/Component": {
    "member-property": {
      rules: overrideRules,
      parserOptions: getParserOptions
    }
  }
};
