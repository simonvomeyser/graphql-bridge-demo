import { GraphQLFloat, GraphQLString, GraphQLObjectType } from 'graphql';

/**
 * Simple object typ a response from api gets mapped to
 */
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
