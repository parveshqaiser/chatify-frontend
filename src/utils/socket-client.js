
import { io } from "socket.io-client";

let SOCKET_URL = "http://localhost:7500";

/*
export const socketConnection = ()=>{
    return io(SOCKET_URL)
}
*/

let socket = null;

export let createSocketConnection = () => {
    if (!socket) {
        socket = io(SOCKET_URL);
    }
    return socket;
};

export let disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};