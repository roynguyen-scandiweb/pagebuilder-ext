import {GoogleApiWrapper, InfoWindow, Map, Marker} from 'google-maps-react';
import {escapeHtml} from '../../helper/functions';

const parseLocations = (locationsString) => {
  let locationsArr = []
  try {
    locationsArr = JSON.parse(locationsString) // We are expecting an array to be returned
    locationsArr.forEach(function (location) {
      location.position.lat = parseFloat(location.position.latitude);
      location.position.lng = parseFloat(location.position.longitude);
      buildAccessors(location)
    });
  } catch (e) {
    locationsArr = []
  }
  return locationsArr
}

const escapeHtmlProps = mapProps => {
  ['location_name', 'comment', 'phone', 'address', 'city', 'country', 'state', 'zipcode'].forEach(field => {
    if (field in mapProps) {
      mapProps[field] = escapeHtml(mapProps[field]).replace(/(?:\r\n|\r|\n)/g, '<br/>')
    }
  })
};

const buildAccessors = (location) => {
  const { city, state, zipcode: zipCode } = location
  const cityComma = city !== '' && (zipCode !== '' || state !== '') ? ', ' : ''
  location.areaAddress = city + cityComma + state + zipCode
};

const generateBounds = function (googleMap, locations) {
  if (!locations || locations.length === 0) {
    return null
  }
  const points = locations.map(l => l.position);
  const bounds = new googleMap.maps.LatLngBounds();
  for (let i = 0; i < points.length; i++) {
    bounds.extend(points[i]);
  }
  return bounds
};

export class GoogleMap extends React.PureComponent {
  defaultProps = {
    center: {
      lat: 30.2672,
      lng: -97.7431
    },
    zoom: 8
  };

  constructor(props) {
    super(props);

    const {
      BaseGoogleMap
    } = props.elements;
    const { propsBag } = BaseGoogleMap;
    const mapProps = (propsBag && propsBag[0]) || {}
    escapeHtmlProps(mapProps)

    const locations = parseLocations(mapProps['data-locations'])
    this.state = {
      locations,
      options: {
        scrollwheel: true,
        disableDoubleClickZoom: false,
        disableDefaultUI: mapProps['data-show-controls'] !== 'true',
        mapTypeControl: mapProps['data-show-controls'] === 'true'
      },
      bounds: generateBounds(props.google, locations),
      showingInfoWindow: false,
      activeMarker: {},
      activeLocationIdx: undefined,
      selectedPlace: {}
    }
  }

  onMarkerClick = ({ props, marker }, index) => {
    return this.setState({
      selectedPlace: props,
      activeMarker: marker,
      activeLocationIdx: index,
      showingInfoWindow: true
    });
  };

  onMapClicked = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    const {
      BaseGoogleMap
    } = this.props.elements;
    const { locations, activeLocationIdx, showingInfoWindow, activeMarker } = this.state;

    return <BaseGoogleMap.Ele>
      <Map google={this.props.google} zoom={this.defaultProps.zoom} initialCenter={this.defaultProps.center}
           onClick={this.onMapClicked}>
        {locations && locations.map((location, idx) =>
          <Marker
            idx={`marker-${idx}`}
            name={location.location_name}
            title={location.location_name}
            position={location.position}
            onClick={(props, marker, e) => this.onMarkerClick({ props, marker, e }, idx)}
          />
        )}
        <InfoWindow marker={activeMarker} visible={showingInfoWindow}>
          {locations[activeLocationIdx] && <div>
            <h3>{locations[activeLocationIdx].location_name}</h3>
            <p>{locations[activeLocationIdx].comment}</p>
            <p>Phone: {locations[activeLocationIdx].phone}</p>
            <p><span>
              {locations[activeLocationIdx].address}
              <br />
              {locations[activeLocationIdx].areaAddress}
              <br />
              {locations[activeLocationIdx].country}
            </span></p>
          </div>}
        </InfoWindow>
      </Map>
    </BaseGoogleMap.Ele>
  }
}


export default GoogleApiWrapper((props) => ({ apiKey: props.apiKey }))(GoogleMap)
