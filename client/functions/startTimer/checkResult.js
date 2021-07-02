const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json"); // Update this to your file

// Initialise the admin with the credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Set up an instance of the DB
const firestore = admin.firestore();

const checkTodayResult = async (uid) => {
  const userRef = firestore.doc(`users/${uid}`);
  let snap = await userRef.get();
  let data = snap.data();

  if (data.onAmission) {
    const tasksRef = userRef.collection(`tasks`);
    try {
      let tasksSnapshot = await tasksRef
        .where("addedToMyDay", "==", true)
        .get();
      let mydayTasks = tasksSnapshot.docs.map((doc) => doc.data());
      let notFinished = mydayTasks.some((task) => !task.checked);

      let date = new Date();
      let yesterday = new Date().setDate(date.getDate() - 1);

      let result = {
        id: Date.now(),
        title: notFinished ? "L" : "W",
        start: yesterday,
        end: yesterday,
      };

      await userRef.collection("events").doc().set({
        todayResult: result,
        tasks: mydayTasks,
      });

      await userRef.update({
        onAmission: false,
      });

      mydayTasks.forEach(async (task) => {
        await tasksRef.doc(task.id).update({
          addedToMyDay: false,
        });
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ res: "success" }),
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        body: JSON.stringify({ res: "error" }),
      };
    }
  }
  return {
      statusCode: 200,
      body: JSON.stringify({res: "user is not on a mission"})
  }
};

export async function handler(event) {
  let uid = event.queryStringParameters.id;
  console.log("checking result for user", uid);

  let res = await checkTodayResult(uid);

  return {
    statusCode: 200,
    body: JSON.stringify(res),
  };
}
