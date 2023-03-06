import express from "express";
import cors from "cors";
import googleStrategy from "./lib/auth/googleAuth.js";
import errorHandler from "./lib/tools/errorHandler.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import { newConnectionHandler } from "./lib/tools/socketSettings.js";
import { verifyAccessToken } from "./lib/tools/tokenTools.js";
import userRouter from "./api/routers/userRouter.js";
export const server = express(); // <---- THIS IS THE EXPRESS SERVER
export const httpServer = createServer(server); // <---- THIS IS THE HTTP SERVER
export const io = new SocketServer(httpServer); // <---- THIS IS THE SOCKET SERVER
io.use(async (socket, next) => {
    const token = socket.handshake.headers.cookie?.split(";")[0].replace("accessToken=", ""); // read the token from the cookie
    if (token) {
        const isAllowed = await verifyAccessToken(token); // verify the token
        if (isAllowed?.id) { // if the token is valid
            console.log("is", isAllowed.id); // log the user id
            next(); // allow the connection
        }
        else {
            console.log('auth failed'); // else - log the error
        }
    }
});
io.on('connection', newConnectionHandler); // <---- THIS IS THE SOCKET CONNECTION HANDLER
passport.use("google", googleStrategy); // <---- THIS IS THE GOOGLE STRATEGY
server.use(cors({
    origin: [
        "http://localhost:3001",
        "http://localhost:3000"
    ],
    credentials: true // set the credentials to true
}));
server.use(cookieParser()); // <---- THIS IS THE COOKIE PARSER MIDDLEWARE
server.use(express.json()); // <---- THIS IS THE JSON PARSER MIDDLEWARE
server.use(passport.initialize()); // <---- THIS IS THE PASSPORT MIDDLEWARE
server.use("/user", userRouter); // <---- THIS IS THE ROUTER MIDDLEWARE
server.use(errorHandler); // <---- THIS IS THE ERROR HANDLER MIDDLEWARE
