const errorHandler = (err, req, res, next) => {  // <---- THIS IS THE ERROR HANDLER
    /* console.log("error check",err) */
    switch (err.status){
      case 400:                                                                         //if the error is a 400
        res.status(400).send({ message: err.message, errorsList: err.errorsList });    //send a 400 with the message and the errorsList
        console.log("400 in errorHandler", err.status);                                //log the error
        break;
  
      case 401:                                                                        //if the error is a 401
        res.status(401).send({ message: err.message });                              //send a 401 with the message
        console.log("401 in errorHandler", err.status);                             //log the error
        break;
  
      case 403:                                                                       //if the error is a 403
        res.status(403).send({ message: err.message });                          //send a 403 with the message
        console.log("403 in errorHandler", err.status);                        //log the error
        break;
  
      case 404:                                                                      //if the error is a 404
        res.status(404).send({ success: false, message: err.message });              //send a 404 with the message
        console.log("404 in errorHandler", err.status);                          //log the error
        break;
  
      default:
        console.log("500 in errorHandler", err.status);                                                         //log the error
        res.status(500).send({ message: "Generic Server Error - Error Logged - We're on our way to fix it!" }); //send a 500 with the message
    }
  }
  
  export default errorHandler;
  
  