import twitterTweetResourceSnapshot from './twitterTweetResourceSnapshot';
import composeWithJson from 'graphql-compose-json';

/**
 * Really simple creation of Tweet type with a snapshot from the API
 */
const TwitterUserTC = composeWithJson(
  'TwitterTweet',
  twitterTweetResourceSnapshot
);

export default TwitterUserTC.getType();
