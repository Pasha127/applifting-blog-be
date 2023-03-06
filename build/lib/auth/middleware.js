import createHttpError from "http-errors";
import { refreshTokens, verifyAccessToken } from "../tools/tokenTools.js";
export const JWTAuth = async (req, res, next) => {
    if (!req.cookies.accessToken) { //if no access token in cookies
        next(createHttpError(401, "No access token in cookies.")); //throw error
    }
    else {
        try {
            const currentAccessToken = req.cookies.accessToken; //get access token from cookies
            const payload = await verifyAccessToken(currentAccessToken); //verify access token
            if (payload.result !== "fail") { //if access token is valid
                /* console.log("passingToken") */
                req.user = {
                    _id: payload._id,
                    username: payload.username,
                    role: payload.role //add role
                };
                next(); //call next middleware
            }
            else {
                const { accessToken, refreshToken, user } = await refreshTokens(req.cookies.refreshToken); //refresh tokens if token invalid (refreshTokens will check if refresh token is valid)
                req.user = {
                    _id: user._id,
                    username: user.username,
                    role: user.role //add role
                };
                req.newTokens = {
                    accessToken,
                    refreshToken //add new refresh token
                };
                next();
            } //call next middleware
        }
        catch (error) { //if error
            console.log(error); //log error
            next(createHttpError(401, "Token invalid!")); //throw error
        }
    }
};
export const AdminOnly = async (req, res, next) => {
    if (req.user.role !== "Admin") { //if user is not admin
        next(createHttpError(401, "Access Denied")); //throw error
    }
    next(); //call next middleware
};
