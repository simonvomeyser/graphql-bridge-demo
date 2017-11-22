import gitHubUserSnapshot from './gitHubUserResourceSnapshot';
import composeWithJson from 'graphql-compose-json';
import GraphQLGitHubBridge from '../../graphql-bridges/github/GraphQLGitHubBridge';

const GitHubUserTC = composeWithJson('GitHubUser', gitHubUserSnapshot);

export default {
  type: GitHubUserTC.getType(),
  resolve(parentValue) {
    return new GraphQLGitHubBridge().getUser(parentValue.name);
  },
};
