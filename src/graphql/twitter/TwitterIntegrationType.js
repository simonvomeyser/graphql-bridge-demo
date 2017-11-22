import { GraphQLString, GraphQLObjectType } from 'graphql';

import TwitterUserType from './TwitterUserType';
import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';

const TwitterIntegrationType = new GraphQLObjectType({
  name: 'TwitterIntegration',
  fields: {
    user: {
      type: TwitterUserType,
      resolve(parentValue, args, request) {
        return new GraphQLTwitterRestBridge().getUser(request.args.name);
      },
    },
    tweets: {
      type: GraphQLString,
    },
  },
});

export default TwitterIntegrationType;
