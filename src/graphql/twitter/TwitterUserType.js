import { GraphQLString, GraphQLInt, GraphQLObjectType, GraphQLList } from 'graphql';

import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import GraphQLGeoCodingRestBridge from '../../graphql-bridges/google/GraphQLGeoCodingRestBridge';

import TwitterTweetType from './TwitterTweetType';
import GoogleGeoCodeType from '../google/GoogleGeoCodeType';
import GitHubUserType from '../github/GitHubUserType';
import GraphQLGitHubBridge from '../../graphql-bridges/github/GraphQLGitHubBridge';

const GoogleGeoCodeIntegration = new GraphQLGeoCodingRestBridge();
const TwitterIntegration = new GraphQLTwitterRestBridge();
const GitHubIntegration = new GraphQLGitHubBridge();

const TwitterUserType = new GraphQLObjectType ({
  name: 'TwitterUser',

  fields: () => ({
    name: {
      type: GraphQLString,
    },
    screen_name: {
      type: GraphQLString,
    },
    location: {
      type: GraphQLString
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
    gitHubUser: {
      type: GitHubUserType,
      resolve(parentValue) {
        return GitHubIntegration.getUser(parentValue.screen_name);
      },
    }
  }),

});

export default TwitterUserType;