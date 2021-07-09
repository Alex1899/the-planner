var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const axios = require("axios");
const moment = require("moment-timezone")
var cors = require('cors')
var app = express();


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors())
// app.use("/", (req, res, next) => {
//   res.render("index", { title: "The Planner Server" });
// });

app.get("/", (req, res, next) => {
  res.render("index", { title: "The Planner Server"})
})

app.post("/api/startTimer", (req, res, next) => {

  let {uid, timezone} = req.body;

  const time = moment().tz(timezone)
  console.log(time.format('HH:mm:ss'))
  let secs =
    24 * 60 * 60 -
    time.hours() * 60 * 60 -
    time.minutes() * 60 -
    time.seconds();

  console.log("received user", uid);
  console.log("timezone", timezone)
  console.log("time left in secs", secs)
  let timer = null;

  // start timer
  let timerName = uid;

  console.log("need to wait", secs);
  axios.get(`https://timercheck.io/${timerName}/${secs}`).then((res) => {
    console.log("timer started...");
    let secondsLeft = secs;

    timer = setTimeout(() => {
      console.log("timer expired! checking result....");
      axios
        .get(
          `https://the-planner.netlify.app/.netlify/functions/checkResult?id=${uid}`
        )
        .then(() => console.log("result checked"))
        .catch((e) => console.log(e));
    }, secondsLeft * 1000);

    let interval = setInterval(() => {
      console.log("checking timer status...");
      axios
        .get(`https://timercheck.io/${timerName}`)
        .then((res) => {
          console.log("seconds remaining: ", res.data.seconds_remaining);
        })
        .catch((e) => {
          if (e.response.status === 504) {
            console.log("timer timedOut...");
            console.log("clearing interval and timer...");

            clearTimeout(timer);
            clearInterval(interval);
          }
        });
    }, 3600 * 1000);
  });

  res.send({ data: "received" });
});

app.get("/api/stopTimer/:id", (req, res, next) => {
  let timerName = req.params.id;
  axios.get(`https://timercheck.io/${timerName}/0`).then(() => {
    console.log("timer stopped...");
  });

  res.send({ data: "stopped" });
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
