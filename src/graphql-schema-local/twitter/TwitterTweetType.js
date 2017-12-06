import twitterTweetResourceSnapshot from './twitterTweetResourceSnapshot';
import composeWithJson from 'graphql-compose-json';

const TwitterUserTC = composeWithJson(
  'TwitterTweet',
  twitterTweetResourceSnapshot
);

export default TwitterUserTC.getType();
