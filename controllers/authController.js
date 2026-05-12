const { register, login } = require('../services/authService');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role, phone } = req.body;
        const user = await register(name, email, password, role, phone);
        res.status(201).json({
             message: 'User registered successfully',
             data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
             }
        });

    } catch (error) {
        next(error);
    }};

    // login user
    const loginUser = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const user = await login(email, password);
            res.status(200).json({message: "login successful"});
        } catch (error) {
            next(error);
        }};

        module.exports = { registerUser, loginUser };