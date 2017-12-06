import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import express from 'express';
import { mergeSchemas } from 'graphql-tools';

// Get the two schemas, the second one needs to be resolved
import localSchema from './graphql-schema-local/schema';
import gitHubSchemaPromise from './graphql-schema-github/getGitHubSchema';

async function run() {
  const app = express();

  const gitHubSchema = await gitHubSchemaPromise();

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
