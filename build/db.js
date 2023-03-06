import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
const { PG_DB, PG_HOST, PG_PORT, PG_PW, PG_USER } = process.env; //define the env variables
const sequelize = new Sequelize(PG_DB, PG_USER, PG_PW, {
    host: PG_HOST,
    port: PG_PORT ? parseInt(PG_PORT) : 5432,
    dialect: "postgres",
    typeValidation: true, //define the typeValidation
});
export const pgConnect = async () => {
    try {
        await sequelize.authenticate(); //connect to the db
        console.log("connnected to PG"); //log the connection
    }
    catch (error) { //if there is an error
        console.log(error); //log the error
        process.exit(1); //exit the process
    }
};
export const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true }); //sync the models
        console.log("synced"); //log the sync
    }
    catch (error) { //if there is an error
        console.log(error); //log the error
    }
};
export default sequelize;
