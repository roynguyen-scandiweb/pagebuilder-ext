import Html from 'SourceComponent/Html';
import {isString} from '../../helper/functions';

export class HtmlCode extends React.PureComponent {
  render() {
    const {
      BaseHtmlCode
    } = this.props.elements;

    const children = BaseHtmlCode.childEleBag[0]

    return <BaseHtmlCode.Ele>
      {isString(children) ?
        <Html content={children} /> :
        children.map(child => {
          if (isString(child)) {
            return <Html content={child} />
          } else {
            return child
          }
        })
      }
    </BaseHtmlCode.Ele>
  }
}

export default HtmlCode
