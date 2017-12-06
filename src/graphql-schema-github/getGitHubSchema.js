import { createApolloFetch } from 'apollo-fetch';
import { makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools';

// Import config so keys need not to be hardcoded
require('dotenv').config();

/**
 * Returns promise git hub schema to be used via schema stitching
 */
export default async () => {
  // Create helper function to create remote schma
  const createRemoteSchema = async uri => {
    const fetcher = createApolloFetch({ uri });

    // Use fetcher middleware to add auth header for GitHub API
    fetcher.use(({ request, options }, next) => {
      if (!options.headers) {
        options.headers = {};
      }
      options.headers['authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;

      next();
    });

    // Return the actual schma
    return makeRemoteExecutableSchema({
      schema: await introspectSchema(fetcher),
      fetcher,
    });
  };

  // Run the helper function and await its result
  const gitHubSchema = await createRemoteSchema(
    'https://api.github.com/graphql'
  );

  // Return promise
  return gitHubSchema;
};
