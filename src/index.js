
import listEndpoints from "express-list-endpoints"
import {server, httpServer} from "./server.js"
import { pgConnect, syncModels } from "./db.js"

const port = process.env.PORT || 3001                            //define the port
let serverStarted = false;                                       //define a variable to check if the server is started

const startServer = async () => {                               //define a function to start the server
  if (!serverStarted) {                                        //if the server is not started
    await pgConnect()                                          //connect to the db
    await syncModels()                                         //sync the models
    httpServer.listen(port, () => {                           //start the server
      console.table(listEndpoints(server));                    //log the endpoints
      console.log(`Server running on port ${port}`);           //log the port
      serverStarted = true;                                  //set the serverStarted variable to true
    });
  }
};

server.on("error", (error) =>                                //if there is an error
  console.log(`Server not running due to ${error}`)          //log the error
);