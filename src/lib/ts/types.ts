import { Socket } from "socket.io";
import { Model } from "sequelize";


export interface VoteSocket extends Socket {
    articleId: string;
  }

export interface UserModelType extends Model{
  id?:string,
  refreshToken?:string
}
