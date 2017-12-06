import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import express from 'express';

import {
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema,
} from 'graphql-tools';
import { createApolloFetch } from 'apollo-fetch';

import schema from './graphql/schema';

require('dotenv').config();

async function run() {
  const app = express();

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
