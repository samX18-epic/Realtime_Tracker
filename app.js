const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Set up middleware and view engine
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id} ✅`);

  // Listen for location data from a client
  socket.on('send-location', (data) => {
    // Broadcast the received location to all connected clients
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // Correctly handle the disconnect event
  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id} ❌`);
  });
});

// Route for the main page
app.get('/', (req, res) => {
  res.render('index');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});