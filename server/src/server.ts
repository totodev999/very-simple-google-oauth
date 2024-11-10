import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cookie from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

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

  // Decode the ID token
  const decoded = jwt.decode(id_token, { complete: true });
  if (!decoded || !decoded.header) {
    return new Error('Invalid token');
  }
  console.log('decoded', decoded);
  const kid = decoded.header.kid;

  const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs';
  // If you see the above URL, you will see a list of keys like below.
  // You can get the public key of the key using n and e values.
  // But jwks-rsa library will do this for you.
  // {
  //   "n": "3zWQqZ_EHrbvwfuq3H7TCBDeanfgxcPxno8GuNQwo5vZQG6hVPqB_NfKNejm2PQG6icoueswY1x-TXdYhn7zuVRrbdiz1Cn2AsUFHhD-FyUipbeXxJPe7dTSQaYwPyzQKNWU_Uj359lXdqXQ_iT-M_QknGTXsf4181r1FTaRMb-89Koj2ZHSHZx-uaPKNzrS92XHoxFXqlMMZYivqEAUE_kAJp-jQ5I5AAQf318zVGPVJX7BxkbcPaM46SZNJaD0ya7uhKWwluqgSjHkOObI5bbq9LmV3N51jzPgxGrH2OEeQBCXzggYzjMVlNuUnfQbNKvF3Xqc4HHWXulDsszGRQ",
  //   "kty": "RSA",
  //   "use": "sig",
  //   "kid": "1dc0f172e8d6ef382d6d3a231f6c197dd68ce5ef",
  //   "e": "AQAB",
  //   "alg": "RS256"
  // }

  const client = new JwksClient({
    jwksUri: GOOGLE_JWKS_URI,
    requestHeaders: {}, // Optional
    timeout: 30000, // Defaults to 30s
  });
  const getKeyRes = await client.getSigningKey(kid);
  console.log('getKeyRes', getKeyRes, getKeyRes.getPublicKey());

  try {
    // replace the last character of the token. This will make the token invalid.
    // const fakeToken = (id_token as string).substring(0, (id_token as string).length - 1) + '_';

    // If signature is valid, the token is valid
    const verifiedToken = jwt.verify(id_token, getKeyRes.getPublicKey(), {
      complete: true,
    });
    console.log('verifiedToken', verifiedToken);

    // google offers a tokeninfo endpoint to verify id_token
    // const userInfoResponse = await axios.get(
    //   `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`
    // );
    // console.log('User info response:', userInfoResponse.data);

    return res.json(verifiedToken.payload);
  } catch (err) {
    console.log(err);
  }
});

export default app;
