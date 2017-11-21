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

export default TwitterUserType;
