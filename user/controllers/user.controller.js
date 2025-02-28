const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registerUser = async (req, res, next) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { fullname, email, password } = req.body;

        const isUserAlready = await userModel.findOne({ email });

        if (isUserAlready) {
            return res.status(401).json({ message: 'User already exist, Please Login !' });
        }

        const hashedPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(400).json({ message: "Registration Failed !" });
    }

}

module.exports.loginUser = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'User not exist !!!' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(400).json({ message: "Authentication error !" });
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}

module.exports.getUserById = async (req, res, next) => {
    try {
        const userId = req.query.userId; 
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};