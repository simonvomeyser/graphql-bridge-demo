import { GraphQLInt, GraphQLObjectType, GraphQLList } from 'graphql';

import composeWithJson from 'graphql-compose-json';
import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import TwitterTweetType from './TwitterTweetType';

import twitterUserResourceSnapshot from './twitterUserResourceSnapshot';
import Resolver from 'graphql-compose/lib/resolver';

import { GitHubUserTC } from '../github/GitHubUserType';

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
