import { GraphQLString, GraphQLSchema, GraphQLObjectType } from 'graphql';

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      User: {
        type: GraphQLString,
        resolve() {
          return 'User';
        },
      },
    },
  }),
});

export default schema;
