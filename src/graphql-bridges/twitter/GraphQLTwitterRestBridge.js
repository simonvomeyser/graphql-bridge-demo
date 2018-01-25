import { GraphQlRestBridge } from 'graphql-bridge';
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
  async getTweets(name, count) {
    const result = await super.request({
      endpoint: 'https://api.twitter.com/1.1/statuses/user_timeline.json',
      data: {
        screen_name: name,
        count,
      },
    });
    return result;
  }
  async getFriends(name, count) {
    const result = await super.request({
      endpoint: 'https://api.twitter.com/1.1/friends/list.json',
      data: {
        screen_name: name,
        count,
      },
      nester: data => data.users,
    });
    return result;
  }
}
