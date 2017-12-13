import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import express from 'express';
import { mergeSchemas } from 'graphql-tools';

// Get the two schemas, the second one needs to be resolved
import localSchema from './graphql-schema-local/schema';
import gitHubSchemaPromise from './graphql-schema-github/getGitHubSchema';

// Throw errors if keys for apis do not exists
require('dotenv').config();
if (
  !process.env.GITHUB_TOKEN ||
  !process.env.TWITTER_BEARER_TOKEN ||
  !process.env.GOOGLE_GEOCODING_KEY
) {
  throw new Error(
    'You need to provide a token for github, a twitter bearer token and google maps key in a .env file for this app to function'
  );
}

// Run the app inside of async function, so remote github schema can be fetched
async function run() {
  const app = express();

  const gitHubSchema = await gitHubSchemaPromise();

  // Link types from the remote schema with types of the local schema
  const linkSchemaDefs = `
    extend type RootUser {
      GitHubUser: User
    }
    extend type TwitterUser {
      GitHubUser: User
    }
  `;

  // Do the actual merging
  const schema = mergeSchemas({
    schemas: [localSchema, gitHubSchema, linkSchemaDefs],

    // Add resolvers to the linked part of the merged schema
    resolvers: mergeInfo => ({
      RootUser: {
        GitHubUser: {
          fragment: 'fragment RootUserFragment on RootUser {name}',
          resolve(parent, args, context, info) {
            const login = parent.name;
            return mergeInfo.delegate(
              'query',
              'user',
              { login },
              context,
              info
            );
          },
        },
      },
      TwitterUser: {
        GitHubUser: {
          fragment: 'fragment TwitterUserFragment on TwitterUser {screen_name}',
          resolve(parent, args, context, info) {
            const login = parent.screen_name;
            return mergeInfo.delegate(
              'query',
              'user',
              { login },
              context,
              info
            );
          },
        },
      },
    }),
  });

  // Provide graphl endpoint
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

  // Provide graphiql tool
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  // For all other routes, just show message
  app.get('*', (req, res) => {
    res.redirect('/graphiql');
  });

  // Start the app
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
}

// Actually run the app and catch errors
try {
  run();
} catch (e) {
  console.log(e.message);
}
