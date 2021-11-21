const db = require("../models");
const jwt = require("jsonwebtoken");
const {isEmail} = require("../helpers/validation");
const {comparePassword} = require("../helpers/utils");

const User = db.user;

const getUserBy = async (field, value) => {
    const args = {};
    args[field] = value;
    const user = await User.findOne({
        where: args
    });
    return user || false;
}

const login = async (req, res) => {
    const {login, password} = req.body;

    if (!login || !password) {
        return res.status(500).send({
            message: "login and password required"
        })
    }

    const userExists = isEmail(login) ? await getUserBy("email", login.toLowerCase()) : await getUserBy("login", login);

    if (!userExists) {
        return res.status(401).send({
            message: "unknown user login or invalid password."
        })
    }

    const isPasswordValid = await comparePassword(password, userExists.password);

    if (!isPasswordValid) {
        return res.status(401).send({
            message: "invalid password or unknown user login."
        })
    }

    const token = jwt.sign({
        username: userExists.login,
        isAdmin: userExists.role === "admin",
        id: 1
    }, process.env.JWT_SECRET, {expiresIn: 60 * 60});

    res.status(200).send({
        token: token
    });
};


module.exports = {
    login
};