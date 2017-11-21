import GraphQLTwitterRestBridge from '../graphql-bridges/twitter/GraphQLTwitterRestBridge';

import {
  GraphQLString,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';

const TwitterUserType = new GraphQLObjectType({
  name: 'TwitterUser',
  fields: {
    name: {
      type: GraphQLString,
    },
    tweets: {
      type: GraphQLInt,
    },
  },
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: {
      type: GraphQLString,
    },
    twitterIntegration: {
      type: TwitterUserType,
      resolve(parentValue) {
        return new GraphQLTwitterRestBridge().getUser(parentValue.name);
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
        resolve(parentValue, args) {
          return { name: args.name };
        },
      },
    },
  }),
});

export default schema;
