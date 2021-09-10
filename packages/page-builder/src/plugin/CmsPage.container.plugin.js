import '../style/_module.scss'

export class CmsPageContainerPlugin {
  componentDidMount = (args, callback, instance) => {
    // Id = 'html-body' is required by the Dynamic CSS selector of Magento 2 page-builder
    // Ref: https://devdocs.magento.com/page-builder/docs/styles/introduction.html#dynamic-css-selectors
    document.querySelector("body").setAttribute('id', 'html-body');
    callback(...args)
  }
}

const { componentDidMount } = new CmsPageContainerPlugin();
export default {
  "Route/CmsPage/Container": {
    "member-function": {
      componentDidMount
    }
  }
};
