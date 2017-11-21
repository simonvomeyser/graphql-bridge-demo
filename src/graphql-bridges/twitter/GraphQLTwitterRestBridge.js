import { GraphQlRestBridge } from 'graphql-bridge';

export default class GraphQLTwitterRestBridge extends GraphQlRestBridge {
  constructor() {
    super();
  }
  getUser(name) {
    return { name, tweets: 17 };
  }
}
