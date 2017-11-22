import userResourceSnapshot from './userResourceSnapshot';
import composeWithJson from 'graphql-compose-json';

const TwitterUserTC = composeWithJson('TwitterUser', userResourceSnapshot);

export default TwitterUserTC.getType();
