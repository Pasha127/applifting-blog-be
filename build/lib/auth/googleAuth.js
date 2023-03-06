import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserModel from "../../api/models/UserModel.js";
import { createTokens } from "../tools/tokenTools.js";
const googleStrategy = new GoogleStrategy(// <---- THIS IS THE GOOGLE STRATEGY
{
    clientID: process.env.GOOGLE_CLIENT_ID || "**GOOGLE ID**",
    clientSecret: process.env.GOOGLE_SECRET || "**GOOGLE SECRET**",
    callbackURL: `${process.env.LOCAL_URL}/user/googleRedirect`, //get callback url from .env
}, async (_, __, profile, passportNext) => {
    try {
        const { email, sub, picture, given_name, family_name } = profile._json; //get the data from the google profile
        const user = await UserModel.findOne({ where: { email } }); //find the user in the db
        if (user) {
            const tokens = await createTokens(user); //create tokens
            passportNext(null, tokens); //call passport next with null and the tokens
        }
        else {
            const newUser = await UserModel.create({
                email: email.toLowerCase(),
                displayName: given_name + " " + family_name,
                password: null,
                refreshToken: "", // Set to null for now, can be updated later
            });
            const { accessToken } = await createTokens(newUser); //create tokens
            passportNext(null, { accessToken }); //call passport next with null and the tokens
        }
    }
    catch (error) {
        console.log(error); //log the error
        passportNext(error); //call passport next with the error
    }
});
export default googleStrategy;
