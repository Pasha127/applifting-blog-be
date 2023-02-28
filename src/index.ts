
import listEndpoints from "express-list-endpoints"
import {server, httpServer} from "./server"
import { pgConnect, syncModels } from "./db"

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

sequelize.connectionManager.on('connection', (connection) => {     //if the connection is established
    console.log('Postgres connection established');               //log the connection
  });
  
  sequelize.connectionManager.on('disconnect', () => {            //if the connection is disconnected
    console.log('Postgres connection disconnected');            //log the disconnection
  });
  
  sequelize.connectionManager.on('error', (error) => {           //if there is an error
    console.error('Postgres connection failed due to', error);   //log the error
  });                                
server.on("error", (error) =>                                //if there is an error
  console.log(`Server not running due to ${error}`)          //log the error
);