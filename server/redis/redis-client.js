const redis = require("redis");
const { callCheckResult } = require("../utils.js");

let redisConfig = {
  host: process.env.REDIS_LAB_HOSTNAME,
  port: process.env.REDIS_LAB_PORT,
  password: process.env.REDIS_LAB_PASSWORD,
};

var pub, sub;
pub = redis.createClient(redisConfig);

pub.on("error", (e) => console.log(e));

pub.send_command(
  "config",
  ["set", "notify-keyspace-events", "Ex"],
  SubscribeExpired
);

function SubscribeExpired(e, r) {
  sub = redis.createClient(redisConfig);

  const expired_subKey = "__keyevent@0__:expired";

  sub.subscribe(expired_subKey, function () {
    console.log(
      ' [i] Redis Subscribed to "' + expired_subKey + '" event channel : ' + r
    );
    sub.on("message", async function (chan, key) {
      console.log("Time expired for user ", key);
      await callCheckResult(key);
    });
  });
}

module.exports = { pub };
