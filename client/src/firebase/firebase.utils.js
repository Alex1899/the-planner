import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/messaging";
import axios from "axios";

let serverKey =
  "AAAA07FR39k:APA91bGqkWEcsmy09KDO_XORIrTIY2KKsJ64GRYnOwlEEmQuljLryZTfkFVZ070H8OW9ncXG8DhGBF_5iTfLmsKSlyezOwLYc1YWhZ7S1Yk3Ig97l1b_OOI5RbQxi_i35D9V2Bof_fsU";

export const firebaseConfig = {
  apiKey: "AIzaSyBsB_jY5JAtfYmRUN1IN_2dLmT0g-2OPsQ",
  authDomain: "theplanner-fe2a0.firebaseapp.com",
  projectId: "theplanner-fe2a0",
  storageBucket: "theplanner-fe2a0.appspot.com",
  messagingSenderId: "909213032409",
  appId: "1:909213032409:web:2d1708bddb18f0234883c8",
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const messaging = firebase.messaging();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });

export const getToken = (uid) => {
  return messaging
    .getToken({
      vapidKey:
        "BDIuST9FiGNPtaUWe9XFh0-hYkUl3OnnejMFGcI55mg42JSMBmyjHRdWaGtsRU_fjxPlZVfHHw9CZyjnp9u7SME",
    })
    .then((currentToken) => {
      if (currentToken) {
        addUserMessagingToken(uid, currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

const addUserMessagingToken = async (uid, token) => {
  const userRef = firestore.doc(`users/${uid}`);
  try {
    await userRef.set(
      {
        msgToken: token,
      },
      { merge: true }
    );
  } catch (e) {
    console.log(e);
  }
};

export const notifyUser = async (uid, message) => {
  const userRef = firestore.doc(`users/${uid}`);
  const snapshot = await userRef.get();
  let data = snapshot.data();
  let token = data.msgToken;
  axios
    .post(
      "https://fcm.googleapis.com/fcm/send",
      {
        notification: {
          title: "The Planner",
          body: message,
          click_action: "https://the-planner.netlify.app/",
          icon: "/goal-192x192.png",
        },
        to: token,
      },
      {
        headers: {
          Authorization: `key=${serverKey}`,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => console.log("user notified"))
    .catch((e) => console.log(e));
};

export const createUserProfileDoc = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName: displayName
          ? displayName
          : additionalData
          ? additionalData.displayName
          : null,
        email,
        createdAt,
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};

export const getCurrentUser = async () => {
  let promise = new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe();
      let res = null;
      console.log("user here", user);
      if (user) {
        try {
          const userRef = firestore.doc(`users/${user.uid}`);
          const snapshot = await userRef.get();

          res = { id: snapshot.id, ...snapshot.data() };
        } catch (e) {
          console.log("Error connecting to firebase", e);
        }
      }
      resolve(res);
    }, reject);
  });

  return await promise;
};

export const createUserwIthEmailPassword = async (
  { email, password },
  additionalData
) => {
  const { user } = await auth.createUserWithEmailAndPassword(email, password);
  const userRef = await createUserProfileDoc(user, additionalData);
  const userSnapshot = await userRef.get();

  return { id: userSnapshot.id, ...userSnapshot.data() };
};

export const signInWithEmail = async ({ email, password }) => {
  const { user } = await auth.signInWithEmailAndPassword(email, password);
  const userRef = await createUserProfileDoc(user);
  const userSnapshot = await userRef.get();

  return { id: userSnapshot.id, ...userSnapshot.data() };
};

export const signInWithGoogle = async () => {
  const { user } = await auth.signInWithPopup(googleProvider);
  console.log("google user", user);
  const userRef = await createUserProfileDoc(user);
  const userSnapshot = await userRef.get();

  return { id: userSnapshot.id, ...userSnapshot.data() };
};

export const getUserTasks = async (userId) => {
  const ref = firestore.collection(`users/${userId}/tasks`);
  try {
    let tasksSnapshot = await ref.get();
    let allTasks = tasksSnapshot.docs.map((doc) => doc.data());

    return { tasks: allTasks };
  } catch (e) {
    console.log(e);
  }
};

// export const saveTodayResult = async (result) => {};

export const addTaskToFirebase = async (userId, task) => {
  const userDocRef = firestore.doc(`users/${userId}`);

  try {
    await userDocRef
      .collection("tasks")
      .doc(task.id)
      .set({
        ...task,
      });
  } catch (e) {
    console.log("Error adding task to firebase", e);
  }
};

export const removeTaskFromFirebase = async (userId, taskId) => {
  const userRef = firestore.doc(`users/${userId}`);
  try {
    await userRef
      .collection("tasks")
      .doc(taskId)
      .delete()
      .then(() => {
        console.log("Task successfully deleted from firebase!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  } catch (e) {
    console.log("Error while removing task from firebase", e);
  }
};

export const saveResultToFirebase = async (userId, result) => {
  const userRef = firestore.doc(`users/${userId}`);
  try {
    await userRef
      .collection("events")
      .doc()
      .set({
        ...result,
      });
  } catch (e) {
    console.log("Error while saving events to firebase", e);
  }
};

export const getAllUserEvents = async (userId) => {
  const eventsCollection = firestore.collection(`users/${userId}/events`);

  try {
    const eventsSnapshot = await eventsCollection.get();
    let allEvents = eventsSnapshot.docs.map((doc) => doc.data());
    console.log("events from sever", allEvents)
    let events = allEvents.map(event => ({...event.todayResult, tasks: event.tasks}))

    return { events };
  } catch (e) {
    console.log("Error getting events from firebase", e);
    return {};
  }
};

export const updateTaskInFirebase = async (userId, update) => {
  const tasksRef = firestore.doc(`users/${userId}/tasks/${update.taskId}`);
  try {
    await tasksRef.update({
      ...update.fields,
    });
    console.log("updated task " + update.taskId);
  } catch (e) {
    console.log("Error updating task in firebase", e);
    return {};
  }
};

export const startUsersMission = async (uid) => {
  const userRef = firestore.doc(`users/${uid}`);
  let snap = await userRef.get();

  if (!snap.onAmission) {
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

export const checkLocalTasksAndUpdate = async (uid, localTasks) => {
  const tasksRef = firestore.collection(`users/${uid}/tasks`);
  localTasks.forEach(async (task) => {
    let doc = tasksRef.doc(task.id);
    let snap = await doc.get();
    if (!snap.exists) {
      console.log("update needed")
      try {
        await doc.set({
          ...task,
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
};
