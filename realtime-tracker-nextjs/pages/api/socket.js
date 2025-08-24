// pages/api/socket.js
import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  // Check if the socket server is already running
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`A user connected: ${socket.id} ✅`);

      socket.on("send-location", (data) => {
        io.emit("receive-location", { id: socket.id, ...data });
      });

      socket.on("disconnect", () => {
        console.log(`A user disconnected: ${socket.id} ❌`);
      });
    });
  }
  res.end();
};

export default SocketHandler;