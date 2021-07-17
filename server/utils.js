const axios = require("axios");

module.exports.callCheckResult = async (userId) => {
  try {
    let res = await axios.get(
      `${process.env.REACT_APP_URL}/.netlify/functions/checkResult?id=${userId}`
    );
    console.log(`User ${userId} status checked:`, res.data);
  } catch (e) {
    console.log(e);
  }
};

module.exports.checkForTimers = async (pub) => {
  try {
    let {
      data: { data },
    } = await axios.get(
      `${process.env.REACT_APP_URL}/.netlify/functions/getMissionUsers`
    );
    let userIds = data;
    console.log("Received users", userIds);
    if (userIds.length > 0) {
      userIds.forEach(({ uid }) => {
        pub.get(uid, async (err, value) => {
          if (!value) {
            // time expired
            await module.exports.callCheckResult(uid);
          }
        });
      });
    } else {
      console.log("No user is on a mission");
    }
  } catch (e) {
    console.log(e);
  }
};


