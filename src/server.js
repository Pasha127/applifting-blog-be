import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import router from "././api/router/index.js";
import googleStrategy from "./lib/auth/googleAuth.js";
import errorHandler from "./lib/tools/errorHandler.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import { newConnectionHandler } from "./socket/index.js";
import { verifyAccessToken } from "./lib/tools/tokenTools.js";

export const server = express();                                                              // <---- THIS IS THE EXPRESS SERVER
export const httpServer = createServer(server);                                               // <---- THIS IS THE HTTP SERVER
export const io = new SocketServer(httpServer);                                               // <---- THIS IS THE SOCKET SERVER
io.use( async(socket, next) => {                                                             // <---- THIS IS THE SOCKET AUTH MIDDLEWARE
  const token = socket.handshake.headers.cookie?.split(";")[0].replace("accessToken=", "");  // read the token from the cookie
 const isAllowed = await verifyAccessToken(token)                                             // verify the token
  if (isAllowed._id) {                                                                      // if the token is valid
    console.log("is",isAllowed._id)                                                        // log the user id
    next();                                                                             // allow the connection
  } else {
    console.log('auth failed')                                                          // else - log the error
  }
})
io.on('connection', newConnectionHandler)                                                  // <---- THIS IS THE SOCKET CONNECTION HANDLER

passport.use("google", googleStrategy)                                                     // <---- THIS IS THE GOOGLE STRATEGY
server.use(cors({                                                                         // <---- THIS IS THE CORS MIDDLEWARE
  origin: [
    "http://localhost:3001",                                                            // <---- THESE ARE THE FRONTEND URLS
      "http://localhost:3000"
  ],
  credentials: true                                                                    // set the credentials to true
}));
server.use(cookieParser());                                                            // <---- THIS IS THE COOKIE PARSER MIDDLEWARE
server.use(express.json());                                                          // <---- THIS IS THE JSON PARSER MIDDLEWARE
server.use(passport.initialize());                                                 // <---- THIS IS THE PASSPORT MIDDLEWARE
server.use("/", router);                                                          // <---- THIS IS THE ROUTER MIDDLEWARE
server.use(errorHandler);                                                       // <---- THIS IS THE ERROR HANDLER MIDDLEWARE
