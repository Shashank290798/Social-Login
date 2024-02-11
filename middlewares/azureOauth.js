const OAuth2Strategy = require('passport-oauth2');
const passport = require('passport');
const axios = require('axios');
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

const config = {
    clientID: process.env.AZURE_CLIENT_ID,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
    callbackURL: process.env.AZURE_CALLBACK_URL,
    authorizationURL: process.env.AZURE_AUTHORIZATION_URL,
    tokenURL: process.env.AZURE_TOKEN_URL,
    scope: ['openid', 'profile', 'offline_access', 'User.Read'],
};

// Function to get user details from Microsoft Graph API
const getUserDetails = async (accessToken) => {
    try {
        const url = 'https://graph.microsoft.com/v1.0/me';
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
        };
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        // Handle error
        throw new Error(error.message)
    }
};

passport.use('oauth2', new OAuth2Strategy(config, async (accessToken, refreshToken, profile, cb) => {
    profile = await getUserDetails(accessToken);
    return cb(null, profile);
}));

