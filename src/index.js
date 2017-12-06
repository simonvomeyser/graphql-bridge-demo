import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import express from 'express';

import {
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema,
} from 'graphql-tools';
import { createApolloFetch } from 'apollo-fetch';

import localSchema from './graphql/schema';
require('dotenv').config();

async function run() {
  const createRemoteSchema = async uri => {
    const fetcher = createApolloFetch({ uri });
    fetcher.use(({ request, options }, next) => {
      if (!options.headers) {
        options.headers = {}; // Create the headers object if needed.
      }
      options.headers['authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

      next();
    });
    return makeRemoteExecutableSchema({
      schema: await introspectSchema(fetcher),
      fetcher,
    });
  };

  const app = express();

  const gitHubSchema = await createRemoteSchema(
    'https://api.github.com/graphql'
  );

  const linkSchemaDefs = `
    extend type RootUser {
      GitHubUser: User
    }
    extend type TwitterUser {
      GitHubUser: User
    }
  `;

  const schema = mergeSchemas({
    schemas: [localSchema, gitHubSchema, linkSchemaDefs],
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

  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

  app.get('*', (req, res) => {
    res.send('Visit /graphql to use this app');
  });

  const port = process.env.PORT || 4000;

  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
}

try {
  run();
} catch (e) {
  console.log(e, e.message, e.stack);
}
