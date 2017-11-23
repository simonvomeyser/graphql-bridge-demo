import gitHubUserSnapshot from './gitHubUserResourceSnapshot';
import composeWithJson from 'graphql-compose-json';
import GraphQLGitHubBridge from '../../graphql-bridges/github/GraphQLGitHubBridge';
import { TwitterUserTC } from '../twitter/TwitterUserType';
import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';

const TwitterIntegration = new GraphQLTwitterRestBridge();

const GitHubUserTC = composeWithJson('GitHubUser', gitHubUserSnapshot);

GitHubUserTC.addFields({
  TwitterUser: {
    type: TwitterUserTC.getType(),
    resolve(parentValue, args, request) {
      return TwitterIntegration.getUser(parentValue.login);
    },
  },
});

export default {
  type: GitHubUserTC.getType(),
  resolve(parentValue) {
    return new GraphQLGitHubBridge().getUser(parentValue.name);
  },
};
