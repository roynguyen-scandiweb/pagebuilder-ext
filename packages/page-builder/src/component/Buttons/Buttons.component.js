export class Buttons extends React.PureComponent {
  constructor(props) {
    super(props);
    this.ref = React.createRef()
  }

  componentDidMount() {
    const { BaseButtons } = this.props.elements;
    const { propsBag } = BaseButtons;
    const isSameWidth = propsBag && propsBag[0] && propsBag[0]['data-same-width'] === 'true'

    if (isSameWidth) {
      this.equalizeButtonWidth();
    }
  }

  equalizeButtonWidth() {
    let buttonMinWidth = 0;
    const buttonList = this.ref.current.querySelectorAll('[data-element="link"], [data-element="empty_link"]')
    buttonList.forEach(btn => {
      const buttonWidth = btn.offsetWidth;
      if (buttonWidth > buttonMinWidth) {
        buttonMinWidth = buttonWidth;
      }
    })
    buttonList.forEach((btn, idx) => {
      buttonList[idx].style['min-width'] = buttonMinWidth + 'px'
    })
  }

  render() {
    const { BaseButtons } = this.props.elements;

    return <BaseButtons.Ele ref={this.ref}>
      {BaseButtons.childEleBag[0]}
    </BaseButtons.Ele>
  }
}

export default Buttons
