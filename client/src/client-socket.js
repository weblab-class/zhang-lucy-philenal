import socketIOClient from "socket.io-client";
import { post } from "./utilities";
const endpoint = window.location.hostname + ":" + window.location.port;
export const socket = socketIOClient(endpoint);
socket.on("connect", () => {
  post("/api/initsocket", { socketid: socket.id });
});


//TODO: put socket room code here?? ask ta for help
/* sends message to server with room you're in?? */

//TODO: sends message to server with move you made (what pixel you drew on canvas)
/*  */
