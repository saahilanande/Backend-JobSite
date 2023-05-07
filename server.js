const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// using for allowing cross site request
app.use(cors());

// Getting the mongodb connection string from environment varaible
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb connected succesfully");
});

// Redirecting  the routes to its specific file path
const employerRouter = require("./Route/Employer");
const userRouter = require("./Route/User");
const postRouter = require("./Route/Posting");
const applicationRouter = require("./Route/Application");

app.use("/employer", employerRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/application", applicationRouter);

//Base route
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

//Allowing the server to listen to a specific port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on: ${port}`);
});
