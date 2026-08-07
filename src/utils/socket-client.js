
import { io } from "socket.io-client";

let BASE_URL = "http://localhost:7500";

export const socketConnection = ()=>{
    return io(BASE_URL)
}