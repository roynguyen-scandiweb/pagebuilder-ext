import {Field} from 'Util/Query';

export class GoogleMapQuery {
  getQuery() {
    return new Field('googleMapConfig')
    .addField('apiKey');
  }
}

export default new GoogleMapQuery();
