import classNames from 'classnames';

export class Tab extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIdx: 0
    }
  }

  onClickTabMenu = (e, idx) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ activeIdx: idx });
  };

  renderTabContent = (TabItem, activeIdx, TabContent) => <TabContent.Ele>
    {TabItem.propsBag.map((props, idx) => activeIdx === idx &&
      <TabItem.Ele
        key={`tab-content-item-${idx}`}
        {...props}
      >
        {TabItem.childEleBag[idx]}
      </TabItem.Ele>)}
  </TabContent.Ele>;

  renderTabMenu = (TabMenuHeader, activeIdx, TabMenuLink, TabMenuTitle, TabMenu) => <TabMenu.Ele
    className="tabs-navigation ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">
    {TabMenuHeader.propsBag.map((props, idx) =>
      <TabMenuHeader.Ele
        {...props}
        key={`tab-menu-${idx}`}
        className={classNames('tab-header ui-state-default ui-corner-top', { 'ui-tabs-active ui-state-active': activeIdx === idx })}
        onClick={(e) => this.onClickTabMenu(e, idx)}
      >
        <TabMenuLink.Ele {...TabMenuLink.propsBag[idx]}>
          <TabMenuTitle.Ele>{TabMenuTitle.childData[idx]}</TabMenuTitle.Ele>
        </TabMenuLink.Ele>
      </TabMenuHeader.Ele>
    )}
  </TabMenu.Ele>;

  render() {
    const {
      BaseTabs,
      TabMenu,
      TabMenuHeader,
      TabMenuLink,
      TabMenuTitle,
      TabContent,
      TabItem
    } = this.props.elements;
    const { activeIdx } = this.state;

    return <BaseTabs.Ele>
      {this.renderTabMenu(TabMenuHeader, activeIdx, TabMenuLink, TabMenuTitle, TabMenu)}
      {this.renderTabContent(TabItem, activeIdx, TabContent)}
    </BaseTabs.Ele>
  }
}

export default Tab
