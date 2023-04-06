const WebSocket = require("ws");

const port = 8081; // or any other available port
const server = new WebSocket.Server({ port });

const rooms = {};

server.on("connection", (socket, req) => {
  const roomId = new URL(req.url, `http://${req.headers.host}`).searchParams.get("roomId");

  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }
  rooms[roomId].push(socket);

  socket.on("message", (message) => {
    const clients = rooms[roomId];

    clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.on("close", () => {
    rooms[roomId] = rooms[roomId].filter((client) => client !== socket);
  });
});

console.log(`WebSocket server listening on port ${port}`);
