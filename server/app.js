const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const axios = require("axios");
const moment = require("moment-timezone");
const cors = require("cors");
const app = express();

const { pub } = require("./redis/redis-client");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// app.use("/", (req, res, next) => {
//   res.render("index", { title: "The Planner Server" });
// });

app.get("/", (req, res, next) => {
  res.render("index", { title: "The Planner Server" });
});

app.post("/api/startTimer", (req, res, next) => {
  let { uid, timezone } = req.body;
  const time = moment().tz(timezone);
  console.log(time.format("HH:mm:ss"));
  let secs =
    24 * 60 * 60 -
    time.hours() * 60 * 60 -
    time.minutes() * 60 -
    time.seconds();

  pub.set(uid, `user:${uid}`);
  pub.expire(uid, secs);

  console.log("Timer started for user", uid, "expiry in secs:", secs)

  res.send({ data: "received" });
});

app.get("/api/stopTimer/:id", (req, res, next) => {
  let key = req.params.id;
  pub.get(key, (err, value) => {
    if (value) {
      pub.expire(key, 0);
    }
  });
  console.log("Timer stopped for user", key)

  res.send({ data: "timer stopped" });
});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
