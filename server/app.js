const express = require("express");
require("express-async-errors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const app = express();

app.set("trust proxy", 1);
app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(compression());
app.use(cookieParser());

app.get("/", (req, res) =>
    res.send("<h1 style='text-align: center'>WELCOME TO THE PERN E-COMMERCE API</h1>")
);

module.exports = app;