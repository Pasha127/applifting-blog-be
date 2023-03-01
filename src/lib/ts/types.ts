import { Socket } from "socket.io";
import { Model } from "sequelize";


export interface VoteSocket extends Socket {   // socket type for the vote socket which extends the socket type
    articleId: string;                         // add the articleId property
  }

export interface UserModelType extends Model{ // user model type which extends the model type
  id?:string,                                // add the id property
  refreshToken?:string                      // add the refreshToken property
}
