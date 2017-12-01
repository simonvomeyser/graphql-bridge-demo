import { GraphQLFloat, GraphQLString, GraphQLObjectType } from 'graphql';

export default new GraphQLObjectType({
  name: 'GoogleGeoCode',
  fields: () => ({
    addressName: {
      type: GraphQLString,
    },
    lat: {
      type: GraphQLFloat,
    },
    lng: {
      type: GraphQLFloat,
    },
  }),
});
