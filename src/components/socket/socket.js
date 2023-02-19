import io from "socket.io-client";
import React from "react";
console.log("SOCKET.JS")
sessionStorage["isConnected"] = "0";
export const socket = io("http://localhost:5000", {
    transports: ["websocket"] // use webSocket only
});
export const SocketContext = React.createContext(socket);