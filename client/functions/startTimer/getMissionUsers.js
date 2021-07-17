const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Update this to your file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const firestore = admin.firestore();

const getOnAmissionUsers = async () => {
  const userRef = firestore.collection("users");
  let snap = await userRef.where("onAmission", "==", true).get();
  let data = [];
  if (snap.docs.length > 0) {
    data = snap.docs.map((doc) => ({ uid: doc.id }));
  }

  return data;
};

export async function handler(event) {
  try {
    let data = await getOnAmissionUsers();
    console.log("fetched on a mission users:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ data }),
    };
  } catch (e) {
    console.log("error durinng getting on a mission users");
    console.log(e.message);
    return {
      statusCode: 500,
      body: JSON.stringify(e.message),
    };
  }
}
