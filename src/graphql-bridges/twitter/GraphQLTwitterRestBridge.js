import { GraphQlRestBridge } from '../../../graphql-bridge'; // @todo change to npm package later

export default class GraphQLTwitterRestBridge extends GraphQlRestBridge {
  constructor() {
    super();
  }
  getUser(name) {
    return { name, tweets: 17 };
  }
}
