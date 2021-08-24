import Html from 'SourceComponent/Html';

export class DynamicBlock extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      BaseDynamicBlock,
      BannerWidget,
      BannerItems,
      BannerItem,
      BannerItemContent
    } = this.props.elements;

    if (!this.props.content) {
      return null
    }

    return <BaseDynamicBlock.Ele>
      <BannerWidget.Ele>
        <BannerItems.Ele>
          {BannerItem.propsBag.map((props, idx) =>
            <BannerItem.Ele {...props} key={`banner-item-${idx}`}>
              <BannerItemContent.Ele {...BannerItemContent.propsBag[idx]}>
                <Html content={this.props.content} />
              </BannerItemContent.Ele>
            </BannerItem.Ele>
          )}
        </BannerItems.Ele>
      </BannerWidget.Ele>
    </BaseDynamicBlock.Ele>
  }
}

export default DynamicBlock
