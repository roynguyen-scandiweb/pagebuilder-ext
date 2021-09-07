import GoogleMapQuery from '../query/GoogleMap.query';
import '../style/_module.scss'

export class CmsPageContainerPlugin {
  componentDidMount = (args, callback, instance) => {
    // Id = 'html-body' is required by the Dynamic CSS selector of Magento 2 page-builder
    // Ref: https://devdocs.magento.com/page-builder/docs/styles/introduction.html#dynamic-css-selectors
    document.querySelector("body").setAttribute('id', 'html-body');
    callback(...args)
  }

  _getPageBuilderConfig() {
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
}

const { componentDidMount } = new CmsPageContainerPlugin();
export default {
  "Route/CmsPage/Container": {
    "member-function": {
      componentDidMount
    }
  }
};
