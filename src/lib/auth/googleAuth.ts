import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import userModel from "../../api/models/UserModel";
import { createTokens } from "../tools/tokenTools";

const googleStrategy = new GoogleStrategy(                                         // <---- THIS IS THE GOOGLE STRATEGY
  {
    clientID: process.env.GOOGLE_CLIENT_ID,                                       //get client id from .env
    clientSecret: process.env.GOOGLE_SECRET,                                     //get client secret from .env
    callbackURL: `${process.env.LOCAL_URL}/user/googleRedirect`,                   //get callback url from .env
  },
  async (_, __, profile, passportNext) => {                                     // <---- THIS IS THE GOOGLE STRATEGY CALLBACK


    try {
      const { email, sub, picture, given_name, family_name } = profile._json;            //get the data from the google profile
      const user = await userModel.findOne({ email });                                   //find the user in the db  ***MUST CONVERT TO POSTGRES***
      if (user) {                                                                       //if user exists
        const tokens = await createTokens(user);                                       //create tokens
        passportNext(null, tokens);                                                  //call passport next with null and the tokens
      } else {
        const newUser = new userModel({                                              //create new user
          email: email.toLowerCase(),                                               //convert email to lowercase
          username: email.split("@")[0],                                          //get the username from the email
          firstName:given_name,                                                 //get the first name from the google profile
          lastName:family_name,                                               //get the last name from the google profile
          avatar: picture                                                   //get the avatar from the google profile
        });
        const createdUser = await newUser.save();                                     //save the user in the db ***MUST CONVERT TO POSTGRES***
        const { accessToken } = await createTokens(createdUser);                    //create tokens
        passportNext(null, { accessToken });                                      //call passport next with null and the tokens
      }
    } catch (error) {
      console.log(error);                                                        //log the error
      passportNext(error);                                                    //call passport next with the error
    }
  }
);

export default googleStrategy;
