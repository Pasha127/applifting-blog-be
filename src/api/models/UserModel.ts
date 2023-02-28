import { DataTypes } from "sequelize"
import curses from "badwords-list";
import sequelize from "../../db";
import ArticleModel from "./ArticleModel";
import CommentModel from "./CommentModel";

const UserModel = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Anonymous",
      validate: {notEmpty: true, not: curses.regex }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true, not: curses.regex }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true, isEmail: true, not: curses.regex }
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }

) 
UserModel.hasMany(ArticleModel,
    {foreignKey: "userId",onDelete:"NO ACTION", hooks:true})
  ArticleModel.belongsTo(UserModel);
UserModel.hasMany(CommentModel,
    {foreignKey: "userId",onDelete:"NO ACTION", hooks:true})
  CommentModel.belongsTo(UserModel);

export default UserModel