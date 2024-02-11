const GoogleStrategy = require('passport-google-oauth2').Strategy;
const passport = require('passport')
const axios = require('axios')
const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });

// this is the important code for passport setup and Google OAuth2 strategy setup
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

const config = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
};


passport.use(new GoogleStrategy(config, async (request, accessToken, refreshToken, profile, done) => {
    // verify the user's profile and authentication details
    request.session.accessToken = accessToken;
    request.session.refreshToken = refreshToken;
    return done(null, accessToken, refreshToken, profile);
}));


const refreshTokenMiddleware = async (req, res, next) => {
    if (req.session && req.session.refreshToken) {
        // Perform token refreshing here
        try {
            const response = await axios.post("https://oauth2.googleapis.com/token", {
                refresh_token: req.session.refreshToken,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                grant_type: 'refresh_token'
            });
            // Update the session with new tokens
            req.session.accessToken = response.data.access_token;
            req.session.refreshToken = response.data.refresh_token;
        } catch (error) {
            throw new Error(error)
        }
    }
    next();
};

module.exports = {
    refreshTokenMiddleware
};

