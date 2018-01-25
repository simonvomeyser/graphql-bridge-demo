
import {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';

import TwitterUserType from './twitter/TwitterUserType';
import GitHubUserType from './github/GitHubUserType';

import GraphQLTwitterRestBridge from '../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import GraphQLGitHubBridge from '../graphql-bridges/github/GraphQLGitHubBridge';

const TwitterIntegration = new GraphQLTwitterRestBridge();
const GitHubIntegration = new GraphQLGitHubBridge();


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: {
      type: GraphQLString,
    },
    twitterUser: {
      type: TwitterUserType,
      resolve(parentValue, args, request) {
        return TwitterIntegration.getUser(parentValue.name);
      },
    },
    GitHubUser: {
      type: GitHubUserType,
      resolve(parentValue, args, request) {
        return GitHubIntegration.getUser(parentValue.name);
      },
    }
  },
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      User: {
        type: UserType,
        args: { name: { type: new GraphQLNonNull(GraphQLString) } },
        resolve(parentValue, args, request) {
          // Pass the name argument down
          return { name: args.name };
        },
      },
    },
  }),
});

export default schema;
