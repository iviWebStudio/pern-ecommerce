const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const token = jwt.sign({
        username: 'superadmin',
        password: "123ABC"
    }, process.env.JWT_SECRET, {expiresIn: 60 * 60});

    res.status(200).send({
        token: token
    });
};


module.exports = {
    login
};