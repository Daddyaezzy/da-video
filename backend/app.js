// start up a node js server

const express = require("express");
const app = express();
const server = require("http").Server(app);
const cors = require("cors");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.POST || 8000;

// app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.send("Server is running");
});
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  console.log(socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", data.signal);
  });
});

server.listen(PORT, function () {
  console.log("listening on " + PORT);
});
