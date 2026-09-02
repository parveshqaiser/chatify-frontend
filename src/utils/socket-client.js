
import { io } from "socket.io-client";

let BASE_URL = "http://localhost:7500";

/*
export const socketConnection = ()=>{
    return io(BASE_URL)
}
*/

let socket = null;

export let createSocketConnection = () => {
    if (!socket) {
        socket = io(BASE_URL);
    }
    return socket;
};

export let disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};