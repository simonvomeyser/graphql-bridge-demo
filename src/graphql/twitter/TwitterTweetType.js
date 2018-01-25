import { GraphQLFloat, GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'TwitterTweet',
  fields: () => ({
    text: {
      type: GraphQLString,
    },
  }),
});