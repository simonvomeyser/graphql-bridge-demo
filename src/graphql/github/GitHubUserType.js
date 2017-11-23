import gitHubUserSnapshot from './gitHubUserResourceSnapshot';
import composeWithJson from 'graphql-compose-json';
import GraphQLGitHubBridge from '../../graphql-bridges/github/GraphQLGitHubBridge';
import { TwitterUserTC } from '../twitter/TwitterUserType';
import GraphQLTwitterRestBridge from '../../graphql-bridges/twitter/GraphQLTwitterRestBridge';
import Resolver from 'graphql-compose/lib/resolver';
import { GraphQLOutputType } from 'graphql';

const TwitterIntegration = new GraphQLTwitterRestBridge();
const GitHubIntegration = new GraphQLGitHubBridge();

const GitHubUserTC = composeWithJson('GitHubUser', gitHubUserSnapshot);

GitHubUserTC.addRelation('TwitterUser', {
  resolver: () => TwitterUserTC.getResolver('getFromGitHub'),
});

GitHubUserTC.addResolver(
  new Resolver({
    name: 'getFromTwitter',
    type: GitHubUserTC,
    resolve: ({ source, args, context, info }) => {
      return GitHubIntegration.getUser(source.screen_name);
    },
  })
);

exports.GitHubUserTC = GitHubUserTC;

export default {
  type: GitHubUserTC.getType(),
  fields: () => {
    GitHubUserTC.getFields();
  },
  resolve(parentValue) {
    return GitHubIntegration.getUser(parentValue.name);
  },
};
