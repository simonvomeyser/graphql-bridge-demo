import graphqlHTTP from 'express-graphql';
import express from 'express';
import schema from './graphql/schema';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.get('*', (req, res) => {
  res.send('Visit /graphql to use this app');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
