import { GraphQLInt, GraphQLObjectType, GraphQLList } from 'graphql';

import composeWithJson from 'graphql-compose-json';
import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import TwitterTweetType from './TwitterTweetType';

import twitterUserResourceSnapshot from './twitterUserResourceSnapshot';

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

exports.TwitterUserTC = TwitterUserTC;
export default {
  type: TwitterUserTC.getType(),
  resolve(parentValue, args, request) {
    return TwitterIntegration.getUser(parentValue.name);
  },
};
