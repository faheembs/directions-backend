const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const { errorConverter, errorHandler } = require("./middleware/error");

require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));

connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(errorConverter);
app.use(errorHandler);
app.use("/", require("./routes"));



module.exports = app;
