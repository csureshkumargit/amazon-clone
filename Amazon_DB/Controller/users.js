const joi = require('@hapi/joi');
//const userRegisterationModel = require('../Model/Users');
const jwt = require('jsonwebtoken');
const userRegisterationModel = require('../Model/authentication/Users');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = joi.object({
    username: joi.string().min(6).max(255),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(255).required()
});

exports.UserRegistartion = async (req, res) => {
    console.log(req.body);
    try {
        const { error } = userSchema.validate(req.body);
        //res.send(validUserRegistration.error.details[0].message)
        if (error)
            return res.status(400).json(error.details[0].message);
        const emailFound = await userRegisterationModel.findOne({ email: req.body.email });
        console.log(emailFound);
        if (emailFound)
            return res.status(200).json({ message: "Email already Exists" });
        const userNameFound = await userRegisterationModel.findOne({ username: req.body.username });
        if (userNameFound)
            return res.status(200).send({ message: "userName already Exists" });

        const Salt = await bcrypt.genSalt(10);
        const hashedpwd = await bcrypt.hash(req.body.password, Salt);

        const newuser = new userRegisterationModel({
            username: req.body.username,
            email: req.body.email,
            password: hashedpwd
        });

        console.log(newuser);
        const addedUser = await newuser.save();
        res.status(200).send({ user: addedUser, message: "You have been registered Successfully." });
    } catch (err) {
        res.status(400).send(err);
    }
}
exports.userLogin = async (req, res) => {
    try {

        const { error } = userSchema.validate(req.body);
        //res.send(validUserRegistration.error.details[0].message)
        if (error)
            return res.status(400).send(error.details[0].message);
        const emailFound = await userRegisterationModel.findOne({ email: req.body.email });
        if (!emailFound) {
            return res.status(200).json({ message: "Email does not exists. Please enter correct Email", isAuthenticated: false });
        }

        // const userNameFound = await userRegisterationModel.findOne({ username: req.body.username });
        // if (!userNameFound)
        //     return res.status(200).send({ message: "userName does not exists. Please enter correct Username" });
        const passwordvalidation = await bcrypt.compare(req.body.password, emailFound.password);
        if (!passwordvalidation)
            return res.status(200).json({ message: "Password in correct", isAuthenticated: false });

        const token = jwt.sign({ userNameFound: emailFound.username }, process.env.CLIENT_KEY);
        return res.header('access-token', token).send({ jwt: token, message: "You have been Logged in Successfully", username: emailFound.username, isAuthenticated: true });
        //return res.status(200).json({ message: "User Logged in Successfully" });

    }
    catch (err) {
        res.status(400).send(err);
    }

}


exports.validateToken = (req, res, next) => {
    const token = req.header('access-token');
    if (!token) {
        //console.log('token');
        return res.status(401).json({ message: 'Access denied.' });
    }
    try {
        const isTokenValid = jwt.verify(token, process.env.CLIENT_KEY);
        console.log(isTokenValid);
        req.isUserValid = true;
        next();
    }
    catch (err) {
        return res.status(400).json({ message: 'Invalid account .' });
    }
}