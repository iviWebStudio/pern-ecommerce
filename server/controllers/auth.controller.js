const {
    refreshTokenHandler,
    addUserHandler,
    extendTokenHandler,
    checkUserLogin,
    generateRefreshToken
} = require("../helpers/services");
const {ErrorHandler} = require("../helpers/error");
const {comparePassword} = require("../helpers/utils");

/**
 *
 * @param user
 * @param res
 * @param status
 * @returns {Promise<void>}
 */
const generateTokenHandler = async (user, res, status = 200) => {
    const token = await extendTokenHandler({
        username: user.login,
        isAdmin: user.role === "admin",
        id: user.id
    });

    const refreshToken = await refreshTokenHandler({
        id: user.id,
        username: user.user,
        isAdmin: user.role === "admin",
    });

    res.header("Auth-token", token);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? true : "none",
        secure: process.env.NODE_ENV !== "development",
    });

    res.status(status).json({
        token: token,
        user: user.id,
    });
}

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const login = async (req, res) => {
    const {login, password} = req.body;

    if (!login || !password) {
        throw new ErrorHandler(500, "login and password required");
    }

    const user = await checkUserLogin(login);

    if (!user) {
        throw new ErrorHandler(401, "unknown user login or invalid password.")
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        throw new ErrorHandler(401, "invalid password or unknown user login.")
    }

    await generateTokenHandler(user, res, 200)
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const signup = async (req, res) => {

    const user = await addUserHandler(req.body);

    await generateTokenHandler(user, res, 201)
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const refreshToken = async (req, res) => {
    if (!req.cookies.refreshToken) {
        throw new ErrorHandler(401, "Token missing");
    }

    const tokens = await generateRefreshToken(
        req.cookies.refreshToken
    );

    res.header("Auth-token", tokens.token);
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? true : "none",
        secure: process.env.NODE_ENV === "production",
    });
    res.json(tokens);
};

module.exports = {
    login,
    signup,
    refreshToken
};