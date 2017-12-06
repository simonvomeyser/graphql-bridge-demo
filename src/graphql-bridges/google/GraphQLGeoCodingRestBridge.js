import { GraphQlRestBridge } from '../../../graphql-bridge'; // @todo change to npm package later
import geoCodingMapper from './geoCodingMapper';
require('dotenv').config();

/**
 * Simple example to integrate the REST API of Google Maps to reverse geocode
 */
export default class GraphQLGeoCodingRestBridge extends GraphQlRestBridge {
  constructor() {
    // Always send key with every request
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
