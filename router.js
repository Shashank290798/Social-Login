const express = require('express');
const router = express();

const authRoute = require('./routes/auth')

router.use('/auth', authRoute)


module.exports = router;
