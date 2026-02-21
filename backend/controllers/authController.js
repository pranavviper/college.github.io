const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, department, registerNumber } = req.body;

    // Validation
    if (!name || !email || !password || !department) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Determine approval status
    const isApproved = email.endsWith('@rajalakshmi.edu.in');

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
        department,
        registerNumber,
        isApproved
    });

    if (user) {
        if (!user.isApproved) {
            return res.status(202).json({
                message: 'Registration successful, but account is pending admin approval'
            });
        }

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            registerNumber: user.registerNumber,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isApproved && user.role !== 'admin') {
            res.status(403);
            throw new Error('Account pending admin approval');
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // Important for frontend redirection
            department: user.department,
            registerNumber: user.registerNumber,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
};

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        res.status(400);
        throw new Error('No Google token provided');
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        const user = await User.findOne({ email });

        if (user) {
            if (!user.isApproved && user.role !== 'admin') {
                res.status(403);
                throw new Error('Account pending admin approval');
            }

            // Log the user in
            return res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                registerNumber: user.registerNumber,
                token: generateToken(user._id),
            });
        } else {
            // User does not exist, tell frontend to prompt for details
            return res.status(202).json({
                message: 'User needs to complete registration',
                email: email,
                name: name,
            });
        }
    } catch (error) {
        res.status(401);
        throw new Error('Invalid Google token');
    }
};

// @desc    Register a new user from Google
// @route   POST /api/auth/google-register
// @access  Public
const googleRegister = async (req, res) => {
    const { token, role, department, registerNumber } = req.body;

    if (!token || !department || !role) {
        res.status(400);
        throw new Error('Please provide token, role, and department');
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        const isApproved = email.endsWith('@rajalakshmi.edu.in');

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Generate a random strong password for the user since they authenticate via Google
        const randomPassword = crypto.randomBytes(16).toString('hex');

        const user = await User.create({
            name,
            email,
            password: randomPassword,
            role,
            department,
            registerNumber,
            isApproved
        });

        if (user) {
            if (!user.isApproved) {
                return res.status(202).json({
                    message: 'Registration successful, but account is pending admin approval'
                });
            }

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                registerNumber: user.registerNumber,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(401);
        throw new Error('Invalid Google token');
    }
};


// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is set by middleware
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
};

// @desc    Change user password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide both old and new passwords');
    }

    const user = await User.findById(req.user.id);

    if (user && (await user.matchPassword(oldPassword))) {
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } else {
        res.status(400);
        throw new Error('Invalid old password');
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save(); // Save the hashed token and expiry to DB

    // Create reset url to email
    const resetUrl = `${req.protocol}://${req.get('host')}/passwordreset/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new Error('Email could not be sent'));
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(201).json({
        success: true,
        message: 'Password Reset Success',
        token: generateToken(user._id)
    });
};

module.exports = {
    registerUser,
    loginUser,
    googleAuth,
    googleRegister,
    getMe,
    changePassword,
    forgotPassword,
    resetPassword,
};
