import createHttpError from "http-errors"
import jwt from "jsonwebtoken"
import userModel from "../../api/models/userModel.js";


export const createTokens = async user => {
  const accessToken = await createAccessToken({ _id: user._id, username: user.username, role: user.role }); //create access token
  const refreshToken = await createRefreshToken({ _id: user._id });                                         //create refresh token
 
  user.refreshToken = refreshToken;                                                                       //save refresh token in db
  await user.save();                                                                                    //save user in db

  return { accessToken, refreshToken }                                                                  //return access and refresh token
}

const createAccessToken = payload => 
  new Promise(function (res, rej) {                                                                    //create access token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {                  //sign the token
      if (err) rej(err);                                                                             //if error reject
      else res(token);                                                                              //else resolve promise
    })
  }
  )

export const verifyAccessToken = accessToken =>
  new Promise((res, rej) =>                                                                       //verify access token
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, originalPayload) => {                   //verify the token using JWT secret
      if (err) res({result: "fail"});                                                           //if error resolve promise with result fail
      else res(originalPayload);                                                               //else resolve promise with original payload
    })
  )

const createRefreshToken = payload =>
  new Promise((res, rej) => {                                                                  //create refresh token
    jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "5d" }, (err, token) => {      //sign the token
      if (err) rej(err);                                                                     //if error reject
      else res(token);                                                                        //else resolve promise
    })
  }
  )

const verifyRefreshToken = refreshToken =>
  new Promise((res, rej) =>                                                                    //verify refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, originalPayload) => {         //verify the token using JWT secret
      if (err) rej(err);                                                                   //if error reject
      else res(originalPayload);                                                        //else resolve promise with original payload
    })
  )

export const refreshTokens = async currentRefreshToken => {
  if(!currentRefreshToken){ throw new createHttpError(401, "Refresh token invalid!")}       //if no refresh token throw error
  try {    
    const refreshTokenPayload = await verifyRefreshToken(currentRefreshToken);                //verify refresh token
    if(!refreshTokenPayload)throw new createHttpError(401, "Refresh token invalid!");        //if no payload throw error
    const user = await userModel.findById(refreshTokenPayload._id);                          //find user in db
    if (!user) throw new createHttpError(404, `User with id ${refreshTokenPayload._id} not found!`); //if no user throw error
    if (user.refreshToken && user.refreshToken === currentRefreshToken) {                  //if refresh token in db and in payload match
      const { accessToken, refreshToken } = await createTokens(user)                     //create new access and refresh token
      return { accessToken, refreshToken, user:user.toObject() }                       //return new access and refresh token and user
    } else {
      throw new createHttpError(401, "Refresh token invalid!")                        //if refresh token in db and in payload don't match throw error
    }
  } catch (error) {
    throw new createHttpError(401, "Refresh token invalid! 2")                          //if caught error throw error
  }
}