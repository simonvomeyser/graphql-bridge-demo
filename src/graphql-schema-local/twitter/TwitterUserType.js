import { GraphQLInt, GraphQLList } from 'graphql';
import composeWithJson from 'graphql-compose-json';

import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import GraphQLGeoCodingRestBridge from '../../graphql-bridges/google/GraphQLGeoCodingRestBridge';

import TwitterTweetType from './TwitterTweetType';
import GoogleGeoCodeType from '../google/GoogleGeoCodeType';

import twitterUserResourceSnapshot from './twitterUserResourceSnapshot';

const GoogleGeoCodeIntegration = new GraphQLGeoCodingRestBridge();
const TwitterIntegration = new GraphQLTwitterRestBridge();

// Create the basic type with the provided sample api data
const TwitterUserTC = composeWithJson(
  'TwitterUser',
  twitterUserResourceSnapshot
);

// Add fields with syntax from 'graphql-compose' lib
// Resovers use Integration Libs
TwitterUserTC.addFields({
  tweets: {
    type: new GraphQLList(TwitterTweetType),
    args: { count: { type: GraphQLInt } },
    resolve(parentValue, args, request) {
      return TwitterIntegration.getTweets(parentValue.screen_name, args.count);
    },
  },
  friends: {
    type: new GraphQLList(TwitterUserTC.getType()),
    args: { count: { type: GraphQLInt } },
    resolve(parentValue, args, request) {
      return TwitterIntegration.getFriends(parentValue.screen_name, args.count);
    },
  },
  geoCodedLocation: {
    type: GoogleGeoCodeType,
    resolve(parentValue) {
      return GoogleGeoCodeIntegration.reverseGeocode(parentValue.location);
    },
  },
});

// Export a complete type so the usage in schema.js is simpler
export default {
  type: TwitterUserTC.getType(),
  fields: () => {
    TwitterUserTC.getFields();
  },
  resolve(parentValue, args, request) {
    return TwitterIntegration.getUser(parentValue.name);
  },
};
