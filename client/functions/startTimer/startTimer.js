const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Update this to your file
const axios = require("axios");
// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set up an instance of the DB
const firestore = admin.firestore();

const startUsersMission = async (userRef) => {
  let snap = await userRef.get();
  let data = snap.data();

  if (!data.onAmission) {
    try {
      await userRef.set(
        {
          onAmission: true,
        },
        { merge: true }
      );

      return { res: "success" };
    } catch (e) {
      console.log(e);
      return { res: "error" };
    }
  } else {
    return { res: "already started" };
  }
};

export async function handler(event) {
  let uid = event.queryStringParameters.id;
  console.log(uid);
  const userRef = firestore.doc(`users/${uid}`);

  let res = await startUsersMission(userRef);
  console.log(res);

  if (res.res === "success") {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/startTimer`, {
        uid,
        timezone,
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ data: "timer started" }),
      };
    } catch (e) {
      console.log(e.message);
      // discard mission
      try {
        await userRef.update({
          onAmission: false,
        });
      } catch (e) {
        console.log(e);
      }

      return {
        statusCode: 500,
        body: JSON.stringify("Error happened on the server :("),
      };
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ data: res.res }),
  };
}
