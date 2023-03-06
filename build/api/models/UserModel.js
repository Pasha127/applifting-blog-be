import { DataTypes } from "sequelize";
import curses from "badwords-list";
import sequelize from "../../db.js";
import ArticleModel from "./ArticleModel.js";
import CommentModel from "./CommentModel.js";
const UserModel = sequelize.define(//define the user model
"user", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Anonymous",
        validate: { notEmpty: true, not: curses.regex } //check to see it is not empty and does not contain a curse word
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, not: curses.regex } //check to see it is not empty and does not contain a curse word
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true, isEmail: true, not: curses.regex } //check to see it is not empty, is an email and does not contain a curse word
    },
    refreshToken: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});
UserModel.hasMany(ArticleModel, //UserModel has many ArticleModel
{ foreignKey: "userId", onDelete: "NO ACTION", hooks: true }); //set the foreign key to userId and do not cascade on delete
ArticleModel.belongsTo(UserModel); //ArticleModel belongs to UserModel
UserModel.hasMany(CommentModel, //UserModel has many CommentModel
{ foreignKey: "userId", onDelete: "NO ACTION", hooks: true }); //set the foreign key to userId and do not cascade on delete
CommentModel.belongsTo(UserModel); //CommentModel belongs to UserModel
export default UserModel;
