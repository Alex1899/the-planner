const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Update this to your file
const axios = require("axios");
// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set up an instance of the DB
const firestore = admin.firestore();

const stopMission = async (uid) => {
  const userRef = firestore.doc(`users/${uid}`);
  let snap = await userRef.get();
  let data = snap.data();

  if (data.onAmission) {
    await userRef.update({
      onAmission: false,
    });
    // stop timer
    await axios.get(`http://localhost:5000/stopTimer/${uid}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ res: "Timer stopped" }),
    };
  }
  console.log("user not on a mission")
  return {
    statusCode: 200,
    body: JSON.stringify({ res: "User not on a mission" }),
  };
};

export async function handler(event) {
  let uid = event.queryStringParameters.id;
  let res = await stopMission(uid);
  console.log(res);

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}
