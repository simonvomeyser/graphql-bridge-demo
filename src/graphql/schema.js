import {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';

import TwitterIntegrationType from './twitter/TwitterIntegrationType';

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: {
      type: GraphQLString,
      resolve(parentValue, args, request) {
        return request.args.name;
      },
    },
    twitterIntegration: {
      type: TwitterIntegrationType,
      resolve() {
        return {};
      },
    },
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
          request.args = args;
          return {};
        },
      },
    },
  }),
});

export default schema;
