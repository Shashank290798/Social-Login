const dotenv = require("dotenv")
dotenv.config({ path: "./config.env" });
const bcrypt = require('bcrypt');

//Importing Models 
const User = require('../models/user')

// Importing Utils
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError')


exports.googleAuth = catchAsync(async (req, res) => {
    const profile = req.user
    let user, inputObj

    if (!profile.given_name || !profile.family_name || !profile.emails[0]?.value) {
        throw new AppError('Missing required fields from Google account. Please complete your account');
    }

    if (!profile.email_verified) {
        throw new AppError('Please verify your google account.')
    }

    user = await User.findOne({ where: { email: profile.emails[0].value } })

    inputObj = {
        firstName: profile.given_name,
        lastName: profile.family_name,
        googleId: profile.id
    }

    if (user && !user.googleId) {
        await user.update(inputObj)
    } else if (!user) {
        inputObj['email'] = profile.emails[0].value
        user = await User.create(inputObj)
    }

    res.statusCode = 200;
    res.json({
        message: "User details successfully saved",
        id: user ? user.id : ''
    });
});


exports.azureAuth = catchAsync(async (req, res) => {
    const profile = req.user
    let user, inputObj

    if (!profile.givenName || !profile.surname || !profile.mail) {
        throw new AppError('Missing required fields from Microsoft account. Please complete your account');
    }
    if (!profile.mail) {
        throw new AppError('Please verify your Microsoft account.')
    }

    user = await User.findOne({ where: { email: profile.mail } })

    inputObj = {
        firstName: profile.givenName,
        lastName: profile.surname,
        microsoftId: profile.id
    }

    if (user && !user.microsoftId) {
        await user.update(inputObj)
    } else if (!user) {
        inputObj['email'] = profile.mail
        user = await User.create(inputObj)
    }

    res.statusCode = 200;
    res.json({
        message: "User details successfully saved",
        id: user ? user.id : ''
    });
});

exports.auth = catchAsync(async (req, res) => {
    const { email, password, mode } = req.body;
    let user, statusCode, message;

    if (!email) {
        throw new AppError(400, "Please provide a valid email");
    }

    if (!password) {
        throw new AppError(400, "Please provide a valid password");
    }

    if (!mode || !['signup', 'signin'].includes(mode)) {
        throw new AppError(400, "Please provide a valid mode (signup or signin)");
    }

    // Check if the email already exists
    const existingUser = await User.findOne({
        where: { email: email }
    })

    if (mode === 'signup' && existingUser && existingUser.password) {
        throw new AppError(400, "Email already registered");
    }

    if (mode === 'signin' && (!existingUser || !existingUser?.password)) {
        throw new AppError(400, "Invalid email or password");
    }

    if (mode === 'signup') {
        // Hash the password

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user record in the database
        user = await User.create({ email, password: hashedPassword });

        // Return a 201 Created response if user creation is successful
        statusCode = 201
        message = "User registration successful"
    } else if (mode === 'signin') {
        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            throw new AppError(400, "Incorrect password");
        }

        statusCode = 200;
        message = "Login successful"
    }

    res.statusCode = statusCode
    res.json({
        message: message,
        id: user?.id ?? existingUser?.id ?? ''
    });
});
