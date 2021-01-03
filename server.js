var express = require("express");
var cors = require("cors");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var path = require("path");
var socketIO = require("socket.io");
var http = require("http");

var messages = [
  {
    userMessage: "abc",
  },
];

var app = express();
var PORT = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", express.static(path.join(__dirname, "public")));

var server = http.createServer(app);
var io = socketIO(server);

io.on("connection", (user) => {
  console.log("a new user connected", user.id);

  //   show notification to current user
  user.emit("NOTIFICATION", "Welcome to chat");
  // shows notification to all other users except the current user
  user.broadcast.emit("NOTIFICATION", "a user has joined the chat");

  user.on("disconnect", () => {
    //   show notification to all users except current user
    io.emit("NOTIFICATION", "a user has left the chat");
  });

  user.on("chatMessage", (msg) => {
    // console.log(msg);
    io.emit("NOTIFICATION", msg);
  });
});

app.post("/chat", (req, res) => {
  messages.push({
    userMessage: req.body.userMessage,
  });
  console.log(messages);
  io.emit("NEW_MESSAGE", JSON.stringify(messages[messages.length - 1]));
  res.send(messages);
});

app.get("/chat", (req, res) => {
  res.send(messages);
});

server.listen(PORT, () => {
  console.log("server is running on port: ", PORT);
});
