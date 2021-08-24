export class Dotdigital extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      iframeHeight: 0
    }
  }

  resizeIframe = () => {
    this.setState({ iframeHeight: document.documentElement.clientHeight })
  };

  renderIframe = () => {
    const { iframeHeight } = this.state;
    const {
      Script
    } = this.props.elements;
    const scriptProps = Script.propsBag[0];
    const domain = scriptProps['data-page-domain'];
    const iframeSrc = `//${domain}/p/${scriptProps['data-page-id']}`

    return <iframe
      src={iframeSrc} id={scriptProps['data-page-id']}
      onLoad={this.resizeIframe}
      className="_lpSurveyEmbed"
      name={scriptProps['data-page-id']} width="100%" frameBorder="0" scrolling="yes" allow="geolocation"
      sandbox="allow-modals allow-downloads allow-top-navigation allow-forms allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      style={{
        border: 'none 0!important;margin:0!important;padding:0!important',
        height: iframeHeight + 'px',
        maxHeight: iframeHeight + 'px'
      }}
    />
  };

  render() {
    const {
      BaseDotForm,
      Wrapper,
      Container,
      Script
    } = this.props.elements;

    return <BaseDotForm.Ele>
      <Wrapper.Ele>
        <Container.Ele>
          <Script.Ele />
          {this.renderIframe()}
        </Container.Ele>
      </Wrapper.Ele>
    </BaseDotForm.Ele>
  }
}

export default Dotdigital
