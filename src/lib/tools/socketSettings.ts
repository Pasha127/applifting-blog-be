import { Socket } from "socket.io";
/* import articleModel from "../api/models/chatModel.js"; */
import  {io}  from "../../server";
import { VoteSocket } from "../ts/types";


export const newConnectionHandler = (newClient: Socket ) => {                                                // <---- THIS IS THE SOCKET HANDLER
 
  newClient.emit("welcome", {                                                                   //Welcome message to the new client
    message: `Connection established on pipeline: ${newClient.id}`                              //Message to the new client
  });

  
 newClient.on("upVote", async(socket: VoteSocket )=>{                                                        //when a client emits an upVote event
    console.log("upVote :", socket.articleId);                                                 //log the articleId
    //change article votes in db                                                               //change the article votes in the db
    //on success emit to all clients                                                          //on success emit to all clients
  }) 
 newClient.on("downVote", async(socket: VoteSocket)=>{                                                     //when a client emits a downVote event
    console.log("downVote :", socket.articleId);                                               //log the articleId
    //change article votes in db                                                              //change the article votes in the db
    //on success emit to all clients                                                          //on success emit to all clients
  }) 

};

