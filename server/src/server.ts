import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cookie from 'cookie-parser';

dotenv.config();

const app = express();

app.use(cookie());

app.get('/api', (req, res, next) => {
  res.send('Hello World!');
});

app.get('/api/auth/google', (req, res) => {
  const state = Math.random().toString(36).substring(7);

  res.cookie('oauth_state', state, { httpOnly: true });

  const clientID = process.env.CLIENT_ID;
  const callbackURL = process.env.CALLBACK_URL;
  console.log(clientID, callbackURL, state);

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${callbackURL}&response_type=code&scope=openid%20email%20profile&state=${state}`;
  res.redirect(authUrl);
});

app.get('/api/googleRedirect', async (req, res): Promise<any> => {
  const { code, state } = req.query;
  const storedState = req.cookies['oauth_state'];

  if (state !== storedState) {
    return res.status(400).send('Invalid state parameter');
  }

  // Clear the state cookie
  res.clearCookie('oauth_state');

  // Exchange authorization code for tokens
  const tokenResponse = await axios.post(
    'https://oauth2.googleapis.com/token',
    {
      code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: process.env.CALLBACK_URL,
    }
  );

  console.log('Token response:', tokenResponse.data);

  const { id_token, access_token } = tokenResponse.data;

  // Decode the ID token to get user info
  const userInfoResponse = await axios.get(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
  );

  console.log('User info response:', userInfoResponse.data);

  const user = userInfoResponse.data;
  return res.json(user);
});

export default app;
