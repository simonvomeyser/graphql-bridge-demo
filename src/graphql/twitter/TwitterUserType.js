import { GraphQLInt, GraphQLObjectType, GraphQLList } from 'graphql';
import Resolver from 'graphql-compose/lib/resolver';
import composeWithJson from 'graphql-compose-json';

import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import GraphQLGeoCodingRestBridge from '../../graphql-bridges/google/GraphQLGeoCodingRestBridge';

import TwitterTweetType from './TwitterTweetType';
import { GoogleGeoCodeTC } from '../google/GoogleGeoCodeType';
import { GitHubUserTC } from '../github/GitHubUserType';

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
    type: GoogleGeoCodeTC.getType(),
    resolve(parentValue) {
      return GoogleGeoCodeIntegration.reverseGeocode(parentValue.location);
    },
  },
});

TwitterUserTC.addResolver(
  new Resolver({
    name: 'getFromGitHub',
    type: TwitterUserTC,
    resolve: ({ source, args, context, info }) => {
      return TwitterIntegration.getUser(source.login);
    },
  })
);

TwitterUserTC.addRelation('GitHubUser', {
  resolver: () => GitHubUserTC.getResolver('getFromTwitter'),
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
