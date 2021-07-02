const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Update this to your file
const axios = require("axios");
// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set up an instance of the DB
const firestore = admin.firestore();

const startUsersMission = async (uid) => {
  const userRef = firestore.doc(`users/${uid}`);
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

  let res = await startUsersMission(uid);
  console.log(res);

  if (res.res === "success") {
    await axios.get(`http://localhost:5000/startTimer/${uid}`);
    return {
      statusCode: 200,
      body: JSON.stringify({data: "timer started"})
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ data: res.res }),
  };
}
