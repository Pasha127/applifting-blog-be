import express from "express";
import createHttpError from "http-errors";
import { Model, Op } from "sequelize";
import UserModel from "../models/UserModel"
import {UserModelType} from "../../lib/ts/types"




const localEndpoint=`${process.env.LOCAL_URL}${process.env.PORT}/users`
/* const serverEndpoint= `${process.env.SERVER_URL}/users` */


const userRouter = express.Router();

userRouter.get("/", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET users at:", new Date());
        const query={};
        const foundUsers = await UserModel.findAll()       
        res.status(200).send(foundUsers)        
    }catch(error){ 
        console.log(error)
        next(error)
    }    
})


userRouter.get("/:userId" , async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET user by id at:", new Date());       
        const foundUser = await UserModel.findByPk(req.params.userId)     
        if(foundUser){
            res.status(200).send(foundUser);
        }else{next(createHttpError(404, "User Not Found"));
    } 
    }catch(error){
        next(error);
    }
})


userRouter.post("/", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "POST new user at:", new Date());
        const newUser:UserModelType = await UserModel.create(req.body);  
        if(newUser){const userId= newUser.id;    
            res.status(201).send({message:`Added a new user.`, userId});} 
        else{
            res.status(401).send({message:`User creation failed`})
        } 
        
    }catch(error: any){
        if(error.errors && error.errors[0].type === 'Validation error'){
            res.status(400).send({message:`Fields are required and can't include curse words.`});
        }        
        next(error);
    }
})
    
userRouter.put("/:userId", async (req,res,next)=>{
    try{ 
        console.log(req.headers.origin, "PUT user at:", new Date());
        const [numUpdated, updatedUser] = await UserModel.update(req.body, {
            where: { id: req.params.userId },
            returning: true
          })
        if(numUpdated === 1){
            res.status(200).send(updatedUser[0]);
        }else{next(createHttpError(404, "User Not Found"));}            
    }catch(error){ 
        next(error);
    }
})


userRouter.delete("/:userId", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "DELETE user at:", new Date());
        const deleted = await UserModel.destroy({
            where: {id:req.params.userId}
        })
        if(deleted === 1){
            res.status(204).send({message:"User has been deleted."})
        }else{
            next(createHttpError(404, "User not found."));    
        }
    }catch(error){
        console.log(error)
        next(error)
    }
})


export default userRouter;
