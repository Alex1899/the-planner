const proxy = require("http-proxy-middleware");
module.exports = function (app) {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    app.use(
      proxy("/.netlify/functions/", {
        target: "http://localhost:9000/",
        pathRewrite: {
          "^/\\.netlify/functions": "",
        },
      })
    );
  }
};
