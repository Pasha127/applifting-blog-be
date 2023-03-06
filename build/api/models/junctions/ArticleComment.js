import { DataTypes } from "sequelize";
import sequelize from "../../../db.js";
const ArticleCommentModel = sequelize.define("articleComment", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    }
});
export default ArticleCommentModel;
