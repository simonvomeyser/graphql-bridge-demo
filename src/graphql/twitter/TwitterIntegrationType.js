import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';

import TwitterUserType from './TwitterUserType';
import TwitterTweetType from './TwitterTweetType';
import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';

const TwitterIntegration = new GraphQLTwitterRestBridge();

const TwitterIntegrationType = new GraphQLObjectType({
  name: 'TwitterIntegration',
  fields: {
    user: {
      type: TwitterUserType,
      resolve(parentValue, args, request) {
        return TwitterIntegration.getUser(request.args.name);
      },
    },
    tweets: {
      type: new GraphQLList(TwitterTweetType),
      resolve(parentValue, args, request) {
        return [];
      },
    },
  },
});

export default TwitterIntegrationType;
