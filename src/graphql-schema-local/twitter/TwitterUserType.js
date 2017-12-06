import { GraphQLInt, GraphQLObjectType, GraphQLList } from 'graphql';
import composeWithJson from 'graphql-compose-json';

import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import GraphQLGeoCodingRestBridge from '../../graphql-bridges/google/GraphQLGeoCodingRestBridge';

import TwitterTweetType from './TwitterTweetType';
import GoogleGeoCodeType from '../google/GoogleGeoCodeType';

import twitterUserResourceSnapshot from './twitterUserResourceSnapshot';

const GoogleGeoCodeIntegration = new GraphQLGeoCodingRestBridge();
const TwitterIntegration = new GraphQLTwitterRestBridge();
const TwitterUserTC = composeWithJson(
  'TwitterUser',
  twitterUserResourceSnapshot
);

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

exports.TwitterUserTC = TwitterUserTC;
export default {
  type: TwitterUserTC.getType(),
  fields: () => {
    TwitterUserTC.getFields();
  },
  resolve(parentValue, args, request) {
    return TwitterIntegration.getUser(parentValue.name);
  },
};
