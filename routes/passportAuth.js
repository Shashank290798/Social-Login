const passport = require('passport');

module.exports = app => {
    app.get('/google',
        passport.authenticate('google',
            {
                scope: ['email', 'profile']
            }));

    app.get('/google/callback',
        passport.authenticate('google', {
            successRedirect: '/googleAuth',
            failureRedirect: '/failed'
        }));

    app.get('/azure',
        passport.authenticate('oauth2', {
            scope: ['openid', 'profile', 'offline_access', 'User.Read']
        })
    );

    app.get('/auth/openid/return',
        passport.authenticate('oauth2', {
            successRedirect: '/azureAuth',
            failureRedirect: '/'
        }),
    );
}
