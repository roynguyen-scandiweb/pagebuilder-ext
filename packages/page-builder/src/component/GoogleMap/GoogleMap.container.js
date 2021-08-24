import DataContainer from 'Util/Request/DataContainer';
import GoogleMap from './GoogleMap.component';
import GoogleMapQuery from '../../query/GoogleMap.query';

export class GoogleMapContainer extends DataContainer {
  static propTypes = {};

  state = {
    googleMapApiKey: undefined
  };

  containerProps = () => {
    const { googleMapApiKey } = this.state;
    return { apiKey: googleMapApiKey, ...this.props };
  };

  componentDidMount() {
    this.fetchGoogleMapApiKey();
  }

  fetchGoogleMapApiKey() {
    this.fetchData(
      [GoogleMapQuery.getQuery()],
      ({ googleMapConfig }) => {

        if (!googleMapConfig || Object.keys(googleMapConfig).length === 0) {
          return;
        }

        this.setState({ googleMapApiKey: googleMapConfig.apiKey });
      }
    );
  }

  render() {
    // API key is required to be presented before init Google Map component
    if (!this.containerProps().apiKey) {
      return null
    }

    return (
      <GoogleMap{...this.containerProps()} />
    );
  }
}

export default GoogleMapContainer;
