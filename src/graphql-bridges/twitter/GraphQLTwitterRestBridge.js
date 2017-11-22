import { GraphQlRestBridge } from '../../../graphql-bridge'; // @todo change to npm package later
require('dotenv').config();

export default class GraphQLTwitterRestBridge extends GraphQlRestBridge {
  constructor() {
    super({}, { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` });
  }
  async getUser(name) {
    const result = await super.request({
      endpoint: 'https://api.twitter.com/1.1/users/show.json',
      data: {
        screen_name: name,
      },
    });
    return result;
  }
}
