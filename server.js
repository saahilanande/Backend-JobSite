const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb connected succesfully");
});

const employerRouter = require("./Route/Employer");
const userRouter = require("./Route/User");
const postRouter = require("./Route/Posting");
const applicationRouter = require("./Route/Application");

app.use("/employer", employerRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/application", applicationRouter);

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on: ${port}`);
});
