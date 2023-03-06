import express from "express";
import createHttpError from "http-errors";
import { Model, Op } from "sequelize";
import UserModel from "../models/UserModel.js"
import {UserModelType} from "../../lib/ts/types.js"




const localEndpoint=`${process.env.LOCAL_URL}${process.env.PORT}/users`           //local endpoint
/* const serverEndpoint= `${process.env.SERVER_URL}/users` */


const userRouter = express.Router();                                                //create router

userRouter.get("/", async (req,res,next)=>{                                        //get all users
    try{
        console.log(req.headers.origin, "GET users at:", new Date());             //log request
        const query={};                                                          //create query object
        const foundUsers = await UserModel.findAll()                               //find all users
        res.status(200).send(foundUsers)                                          //send users
    }catch(error){ 
        console.log(error)                                                      //log error
        next(error)                                                        //send error to error handler
    }    
})


userRouter.get("/:userId" , async (req,res,next)=>{                               //get user by id
    try{
        console.log(req.headers.origin, "GET user by id at:", new Date());        //log request
        const foundUser = await UserModel.findByPk(req.params.userId)        //find user by id
        if(foundUser){                                                         //if user found
            res.status(200).send(foundUser);                                  //send user
        }else{next(createHttpError(404, "User Not Found")); }                  //else send error
    }catch(error){                                                           //catch error
        next(error);                                                      //send error to error handler
    }
})


userRouter.post("/", async (req,res,next)=>{                                  //post new user
    try{
        console.log(req.headers.origin, "POST new user at:", new Date());   //log request
        const newUser:UserModelType = await UserModel.create(req.body);   //create new user
        if(newUser){const userId= newUser.id;                               //if user created
            res.status(201).send({message:`Added a new user.`, userId});}  //send message and user id
        else{
            res.status(401).send({message:`User creation failed`})            //else send error
        } 
        
    }catch(error: any){ 
        if(error.errors && error.errors[0].type === 'Validation error'){                          //if error is validation error
            res.status(400).send({message:`Fields are required and can't include curse words.`}); //send error
        }        
        next(error);                                                                     //else send error to error handler
    }
})
    
userRouter.put("/:userId", async (req,res,next)=>{                                       //update user
    try{ 
        console.log(req.headers.origin, "PUT user at:", new Date());                  //log request
        const [numUpdated, updatedUser] = await UserModel.update(req.body, {         //update user
            where: { id: req.params.userId },                                        //find user by id
            returning: true                                                        //return updated user
          })
        if(numUpdated === 1){                                                      //if user updated
            res.status(200).send(updatedUser[0]);                                //send updated user
        }else{next(createHttpError(404, "User Not Found"));}                      //else send error
    }catch(error){                                                                //catch error
        next(error);                                                           //send error to error handler
    }
})


userRouter.delete("/:userId", async (req,res,next)=>{                                //delete user
    try{
        console.log(req.headers.origin, "DELETE user at:", new Date());                //log request
        const deleted = await UserModel.destroy({                                   //delete user
            where: {id:req.params.userId}                                        //find user by id
        })
        if(deleted === 1){                                                       //if user deleted
            res.status(204).send({message:"User has been deleted."})           //send message
        }else{
            next(createHttpError(404, "User not found."));                        //else send error
        }
    }catch(error){
        console.log(error)                                                     //log error
        next(error)                                                      //send error to error handler
    }
})


export default userRouter;
