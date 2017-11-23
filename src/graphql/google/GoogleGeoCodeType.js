import googleGeoCodingResourceSnapshot from './googleGeoCodingResourceSnapshot';
import composeWithJson from 'graphql-compose-json';

const GoogleGeoCodeTC = composeWithJson(
  'GoogleGeoCode',
  googleGeoCodingResourceSnapshot
);

exports.GoogleGeoCodeTC = GoogleGeoCodeTC;
export default GoogleGeoCodeTC.getType();
