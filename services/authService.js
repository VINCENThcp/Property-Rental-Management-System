const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (name, email, password, role, phone) => {
    // check if user exit
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new Error('email already exist');
        error.statusCode = 400;
        throw error;
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        phone,
    });

    return user;
};

const login = async (email, password) => {
    // check if user exists
    const user = await User.findOne({ email });
    if (!user)  {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    };

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('invalid email or password');
        error.statusCode = 401;
        throw error;
    };

    // generate JWT token
    const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET, // secret goes here
    { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return { user, token };
};

module.exports = { register, login };