import {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';

import TwitterUserType from './twitter/TwitterUserType';
import GitHubUserType from './github/GitHubUserType';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: {
      type: GraphQLString,
    },
    twitterUser: TwitterUserType,
    gitHubUser: GitHubUserType,
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
