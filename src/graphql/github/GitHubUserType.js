import { GraphQLString, GraphQLObjectType } from 'graphql';
import TwitterUserType from '../twitter/TwitterUserType';

import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';

const TwitterIntegration = new GraphQLTwitterRestBridge();

export default new GraphQLObjectType({
  name: 'GitHubUser',
  fields: () => ({
    email: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    twitterUser: {
      type: TwitterUserType,
      resolve(parentValue, args, request) {
        return TwitterIntegration.getUser(parentValue.login);
      },
    }
  }),
});