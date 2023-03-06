import { DataTypes } from "sequelize"
import curses from "badwords-list";
import sequelize from "../../db.js";

const CommentModel = sequelize.define("comment", {                      //define the comment model
    commentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Anonymous",                                                     //default author
      validate: {notEmpty: true,not: curses.regex}                                      //check to see it is not empty and does not contain a curse word
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {notEmpty: true,not: curses.regex}                                     //check to see it is not empty and does not contain a curse word
    }, 
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
  })

  export default CommentModel