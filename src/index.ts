
import listEndpoints from "express-list-endpoints"
import {server, httpServer} from "./server.js"
import sequelize, { pgConnect, syncModels } from "./db.js"
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3001                            //define the port
let serverStarted = false;                                       //define a variable to check if the server is started

const startServer = async () => {                               //define a function to start the server
    if (!serverStarted) {                                        //if the server is not started
        httpServer.listen(port, () => {                           //start the server
            console.table(listEndpoints(server));                    //log the endpoints
            console.log(`Server running on port ${port}`);           //log the port
            serverStarted = true;                                  //set the serverStarted variable to true
        });
    }
};


await pgConnect().then(()=>startServer)                               //connect to the db
await syncModels()                                                    //sync the models
const connectionManager:any = sequelize.connectionManager;

server.on("error", (error) =>                                //if there is an error
  console.log(`Server not running due to ${error}`)          //log the error
);