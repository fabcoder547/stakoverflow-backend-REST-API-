const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");
var PORT = process.env.PORT || 5000;

//bring all routes here
var auth = require("./routs/api/auth");
var profile = require("./routs/api/profile");
var questions = require("./routs/api/questions");

//Mongodb authentication
const db = require("./setup/myUrl").mongoURL;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongodb is connected");
  })
  .catch((err) => {
    console.log("not connected");
    console.log(err);
  });

//initilization

const app = express();
app.use(
  bodyparser.urlencoded({
    extended: false,
  })
);
app.use(bodyparser.json());
app.use(passport.initialize());
require("./strategies/jwtstratagy")(passport);

//routes as a  middleware
app.use("/api/auth", auth);
app.use("/api/profile", profile);
app.use("/api/questions", questions);

app.get("/", (req, res) => {
  res.send("Hey big stack");
});

app.listen(PORT, () => console.log(`'server is listening on ${PORT}'`));
