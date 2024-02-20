const express = require("express");
const cors = require("cors");
const http = require('http');
const socketIo = require("socket.io")
const connectDB = require("./config/database");
const { errorConverter, errorHandler } = require("./middleware/error");
const { initSocketManager } = require("./utils/socketManager");

require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(errorConverter);
app.use(errorHandler);
app.use("/", require("./routes"));
const server = http.createServer(app);


// Socket.IO
const io = socketIo(server, { cors: { origin: "*" } });
initSocketManager(io);

module.exports = server;
