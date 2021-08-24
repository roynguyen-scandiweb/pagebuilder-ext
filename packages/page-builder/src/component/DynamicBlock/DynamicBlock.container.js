import DataContainer from 'Util/Request/DataContainer';
import DynamicBlock from './DynamicBlock.component';
import DynamicBlockQuery from '../../query/DynamicBlock.query';

/** @namespace Component/DynamicBlock/Container */
export class DynamicBlockContainer extends DataContainer {
  static propTypes = {};

  state = {
    content: undefined
  };

  containerProps = () => {
    const { content } = this.state;
    return { content, ...this.props };
  };

  componentDidMount() {
    this.fetchDynamicBlock();
  }

  fetchDynamicBlock() {
    const {
      BannerWidget
    } = this.props.elements;

    const id = BannerWidget.propsBag[0]['data-banner-id']
    this.fetchData(
      [DynamicBlockQuery.getQuery({ id })],
      ({ dynamicBlock }) => {
        if (!dynamicBlock || Object.keys(dynamicBlock).length === 0) {
          return;
        }
        this.setState({ content: dynamicBlock.content });
      }
    );
  }

  render() {
    return (
      <DynamicBlock
        {...this.containerProps()}
      />
    );
  }
}

export default DynamicBlockContainer;
