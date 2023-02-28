import { Socket } from "socket.io";


export interface VoteSocket extends Socket {
    articleId: string;
  }

