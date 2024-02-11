const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const passport = require('passport');
const headers = require('./middlewares/headers');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

const AppError = require('./utils/appError');

const router = require('./router');

const app = express();
dotenv.config({ path: `${__dirname}/config.env` });

app.use(express.json({ limit: '16mb' }));

app.use(helmet());

app.use(headers);

// set up session
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.COOKIESKEY]
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/meta.json', (req, res) => {
    res.json(swaggerDocument);
});


require('./routes/passportAuth')(app)

app.use('/api/v1', router);


app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});


module.exports = app;
