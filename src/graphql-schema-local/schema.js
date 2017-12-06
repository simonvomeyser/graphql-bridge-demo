import {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';

import TwitterUserType from './twitter/TwitterUserType';

// A local user which will have connections to twitterUser
// The connection to githubUser is added later
const UserType = new GraphQLObjectType({
  name: 'RootUser',
  fields: {
    name: {
      type: GraphQLString,
    },
    twitterUser: TwitterUserType,
  },
});

// The basic entrypoint
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      User: {
        type: UserType,
        args: { name: { type: new GraphQLNonNull(GraphQLString) } },
        resolve(parentValue, args) {
          return { name: args.name };
        },
      },
    },
  }),
});

export default schema;
