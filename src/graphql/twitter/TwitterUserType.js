import twitterUserResourceSnapshot from './twitterUserResourceSnapshot';
import composeWithJson from 'graphql-compose-json';

const TwitterUserTC = composeWithJson(
  'TwitterUser',
  twitterUserResourceSnapshot
);

export default TwitterUserTC.getType();
