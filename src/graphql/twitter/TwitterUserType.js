import { GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLList } from 'graphql';

import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import GraphQLGeoCodingRestBridge from '../../graphql-bridges/google/GraphQLGeoCodingRestBridge';

import TwitterTweetType from './TwitterTweetType';
import GoogleGeoCodeType from '../google/GoogleGeoCodeType';

const GoogleGeoCodeIntegration = new GraphQLGeoCodingRestBridge();
const TwitterIntegration = new GraphQLTwitterRestBridge();

const TwitterUserType = new GraphQLObjectType ({
  name: 'TwitterUser',

  fields: () => ({
    name: {
      type: GraphQLString,
    },
    tweets: {
      type: new GraphQLList(TwitterTweetType),
      args: { count: { type: GraphQLInt } },
      resolve(parentValue, args, request) {
        return TwitterIntegration.getTweets(parentValue.screen_name, args.count);
      },
    },
    friends: {
      type: new GraphQLList(TwitterUserType),
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
  }),

});

export default TwitterUserType;