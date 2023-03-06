import createHttpError from "http-errors"
import { refreshTokens, verifyAccessToken } from "../tools/tokenTools.js";

export const JWTAuth = async (req:any, res:any, next:any) => {                                                 //JWT authentication middleware
    if (!req.cookies.accessToken) {                                                               //if no access token in cookies
      next(createHttpError(401, "No access token in cookies."))                                   //throw error
  } else {
    try {
      const currentAccessToken = req.cookies.accessToken                                         //get access token from cookies
      const payload:any = await verifyAccessToken(currentAccessToken)                              //verify access token
      if(payload.result !== "fail"){                                                           //if access token is valid
        /* console.log("passingToken") */
      req.user = {                                                                          //create user data in req
        _id: payload._id,                                                                   //add user id
        username: payload.username,                                                        //add username
        role: payload.role                                                                 //add role
      }
      next()                                                                             //call next middleware
      }else{
        const  {accessToken, refreshToken, user} = await refreshTokens(req.cookies.refreshToken) //refresh tokens if token invalid (refreshTokens will check if refresh token is valid)
      req.user = {                                                                       //create user data in req
        _id: user._id,                                                                  //add user id
        username: user.username,                                                     //add username
        role: user.role                                                             //add role
      };
      req.newTokens={                                                                   //create new tokens data in req
        accessToken,                                                                 //add new access token
        refreshToken                                                              //add new refresh token
      };
      next()}                                                                        //call next middleware
    } catch (error) {                                                                //if error
      console.log(error);                                                              //log error
      next(createHttpError(401, "Token invalid!"))                                  //throw error
    }
  }
}

export const AdminOnly = async (req:any, res:any, next:any) => {                             //Admin only middleware
  if(req.user.role !== "Admin"){                                                 //if user is not admin
    next(createHttpError(401, "Access Denied"))                                   //throw error
  }
  next()                                                                       //call next middleware
}
