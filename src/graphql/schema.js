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
    friends_count: {
      type: GraphQLInt,
    },
  },
});

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

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: {
      type: GraphQLString,
      resolve(parentValue, args) {
        return 'static';
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
