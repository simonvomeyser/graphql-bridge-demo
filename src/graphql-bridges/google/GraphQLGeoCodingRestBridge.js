import { GraphQlRestBridge } from '../../../graphql-bridge'; // @todo change to npm package later
import geoCodingMapper from './geoCodingMapper';
require('dotenv').config();

export default class GraphQLGeoCodingRestBridge extends GraphQlRestBridge {
  constructor() {
    super({ key: process.env.GOOGLE_GEOCODING_KEY });
  }
  async reverseGeocode(address) {
    const result = await super.request({
      endpoint: 'https://maps.googleapis.com/maps/api/geocode/json',
      data: {
        address,
      },
      nester: data => data.results[0],
      mapper: geoCodingMapper,
    });
    return result;
  }
}
