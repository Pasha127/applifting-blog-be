import { DataTypes } from "sequelize"
import curses from "badwords-list";
import sequelize from "../../db";
import CommentModel from "./CommentModel";

const ArticleModel = sequelize.define("article", {                     //define the article model
    articleId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true,not: curses.regex}                                       //check to see it is not empty and does not contain a curse word
    },
    perex: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {notEmpty: true,not: curses.regex}                                       //check to see it is not empty and does not contain a curse word
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {notEmpty: true,not: curses.regex}                                         //check to see it is not empty and does not contain a curse word
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://cdn.pixabay.com/photo/2021/05/31/08/28/dogecoin-6298191_960_720.png",            //default image
      validate:{
        isUrl: true
      }
    },
  })
  ArticleModel.hasMany(CommentModel,
    {foreignKey: "articleId",onDelete:"CASCADE", hooks:true})
  CommentModel.belongsTo(ArticleModel);
  export default ArticleModel