import createHttpError from "http-errors" 
const httpErrorCreator: any = createHttpError;
import jwt from "jsonwebtoken"
import UserModel from "../../api/models/UserModel.js";
import { UserModelType } from "../ts/types";
export const createTokens = async (user: any) => {
  const accessToken = await createAccessToken({ _id: user._id, username: user.username, role: user.role }); //create access token
  const refreshToken = await createRefreshToken({ _id: user._id });                                         //create refresh token
 
  user.refreshToken = refreshToken;                                                                       //save refresh token in db
  await user.save();                                                                                    //save user in db

  return { accessToken, refreshToken }                                                                  //return access and refresh token
}

const createAccessToken = (payload: any) => 
  new Promise(function (res, rej) {                                                                    //create access token
    jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" }, (err, token) => {                  //sign the token
      if (err) rej(err);                                                                             //if error reject
      else res(token);                                                                              //else resolve promise
    })
  }
  )

export const verifyAccessToken = (accessToken: string) =>
  new Promise((res, rej) =>                                                                       //verify access token
    jwt.verify(accessToken, process.env.JWT_SECRET!, (err: any, originalPayload:any) => {                   //verify the token using JWT secret
      if (err) res({result: "fail"});                                                           //if error resolve promise with result fail
      else res(originalPayload);                                                               //else resolve promise with original payload
    })
  )

const createRefreshToken = (payload: any) =>
  new Promise((res, rej) => {                                                                  //create refresh token
    jwt.sign(payload, process.env.REFRESH_SECRET!, { expiresIn: "5d" }, (err, token) => {      //sign the token
      if (err) rej(err);                                                                     //if error reject
      else res(token);                                                                        //else resolve promise
    })
  }
  )

const verifyRefreshToken = (refreshToken: string) =>
  new Promise((res, rej) =>                                                                    //verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET!, (err: any, originalPayload: any) => {         //verify the token using JWT secret
      if (err) rej(err);                                                                   //if error reject
      else res(originalPayload);                                                        //else resolve promise with original payload
    })
  )

  export const refreshTokens = async (currentRefreshToken: string) => {                       //refresh tokens
    if (!currentRefreshToken) {                                                         //if no refresh token
      throw new httpErrorCreator(401, "Refresh token invalid!");                           //throw error
    }
    try {
      const refreshTokenPayload:any = await verifyRefreshToken(currentRefreshToken);              //verify refresh token
      if (!refreshTokenPayload) {                                                          //if no payload
        throw new httpErrorCreator(401, "Refresh token invalid!");                              //throw error
      }
      const user:UserModelType|null = await UserModel.findOne({ where: { id: refreshTokenPayload.id } });                     //find user in db
      if (!user) {                                                                                    //if no user
        throw new httpErrorCreator(404, `User with id ${refreshTokenPayload.id} not found!`);             //throw error
      }
      if (user.refreshToken && user.refreshToken === currentRefreshToken) {                           //if refresh token in db and refresh token in payload match
        const { accessToken, refreshToken } = await createTokens(user);                           //create new tokens
        return { accessToken, refreshToken, user: user.toJSON() };                               //return new tokens and user
      } else {
        throw new httpErrorCreator(401, "Refresh token invalid!");                                 //throw error
      }
    } catch (error) {
      throw new httpErrorCreator(401, "Refresh token invalid!");                                  //throw error
    } 
  };