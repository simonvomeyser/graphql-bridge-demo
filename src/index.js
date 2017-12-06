import * as bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';

import express from 'express';
import schema from './graphql/schema';

require('dotenv').config();

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
