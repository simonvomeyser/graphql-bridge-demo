import { GraphQlBridge } from '../../../graphql-bridge'; // @todo change to npm package later

require('dotenv').config();
export default class GraphQLGitHubBridge extends GraphQlBridge {
  constructor() {
    super(
      'https://api.github.com/graphql',
      {},
      { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    );
  }
  async getUser(name) {
    const result = await this.request({
      query: `
        query {
            user(login: "${name}") {
                bio,
                bioHTML,
                company,
                companyHTML,
                createdAt,
                email,
                id,
                isBountyHunter,
                isCampusExpert,
                isDeveloperProgramMember,
                isEmployee,
                isHireable,
                isSiteAdmin,
                isViewer,
                location,
                login,
                name,
                resourcePath,
                updatedAt,
                url,
                viewerCanFollow,
                viewerIsFollowing,
                websiteUrl,
            }
        }
    `,
      nester: data => data.user,
    });
    return result;
  }
}

//
