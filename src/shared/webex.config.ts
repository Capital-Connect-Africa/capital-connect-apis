import * as dotenv from 'dotenv';
dotenv.config();

export const WebexConfig = {
  clientId: process.env.WEBEX_CLIENT_ID,
  clientSecret: process.env.WEBEX_CLIENT_SECRET,
  redirectUri: process.env.WEBEX_REDIRECT_URI, // For OAuth
  apiBaseUrl: 'https://webexapis.com/v1',
};
