import ScandiPwaSlider from 'SourceComponent/Slider';

export class Slider extends React.PureComponent {
  constructor(props) {
    super(props);
    const { BaseSlider, Slide } = props.elements;
    this.sliderProps = BaseSlider.propsBag.length > 0 ? BaseSlider.propsBag[0] : {}
    this.slidesProps = Slide.propsBag.length > 0 ? Slide.propsBag : []

    this.state = {
      activeImage: 0,
      carouselDirection: 'right',
      imageToShow: 0
    }
  }

  componentDidMount() {
    if (this.sliderProps['data-autoplay'] === 'true') {
      this.startCarousel(this.sliderProps['data-autoplay-speed'] || 5000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.carouselInterval);
  }

  startCarousel = (interval) => {
    this.carouselInterval = setInterval(() => {
      this.getImageToShow();

      const { imageToShow } = this.state;

      this.onActiveImageChange(imageToShow);
    }, interval);
  }

  getImageToShow() {
    const { activeImage, carouselDirection } = this.state;

    if (activeImage === 0) {
      this.setState({
        carouselDirection: 'right',
        imageToShow: activeImage + 1
      });
    } else if (activeImage === this.slidesProps.length - 1) {
      this.setState({
        carouselDirection: 'left',
        imageToShow: activeImage - 1
      });
    } else {
      this.setState({ imageToShow: carouselDirection === 'right' ? activeImage + 1 : activeImage - 1 });
    }
  }

  onActiveImageChange = (activeImage) => {
    this.setState({ activeImage });
  };

  renderSlide = (slide, i) => {
    const { Slide } = this.props.elements;

    return (
      <div key={i}>
        <Slide.Ele {...Slide.propsBag[i]}>
          {Slide.childEleBag[i]}
        </Slide.Ele>
      </div>
    );
  }

  render() {
    const { activeImage } = this.state;
    const { BaseSlider, Slide } = this.props.elements;

    return <BaseSlider.Ele>
      <ScandiPwaSlider
        mix={{ block: 'PageBuilderSlider' }}
        showCrumbs={this.sliderProps['data-show-dots'] === 'true'}
        showArrows={this.sliderProps['data-show-arrows'] === 'true'}
        activeImage={activeImage}
        onActiveImageChange={this.onActiveImageChange}
      >
        {Slide.propsBag.map(this.renderSlide)}
      </ScandiPwaSlider>
    </BaseSlider.Ele>
  }
}

export default Slider
