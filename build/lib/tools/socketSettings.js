export const newConnectionHandler = (newClient) => {
    newClient.emit("welcome", {
        message: `Connection established on pipeline: ${newClient.id}` //Message to the new client
    });
    newClient.on("upVote", async (socket) => {
        console.log("upVote :", socket.articleId); //log the articleId
        //change article votes in db                                                               //change the article votes in the db
        //on success emit to all clients                                                          //on success emit to all clients
    });
    newClient.on("downVote", async (socket) => {
        console.log("downVote :", socket.articleId); //log the articleId
        //change article votes in db                                                              //change the article votes in the db
        //on success emit to all clients                                                          //on success emit to all clients
    });
};
