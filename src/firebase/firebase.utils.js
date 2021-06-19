import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
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

export const createUserProfileDoc = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
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
          console.log("Error connecting to firebase");
          res = {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL,
          };
          resolve(res)
        }
      }
      resolve(res);
    }, reject);
  });

  return await promise;
};

export const signInWithEmail = async ({ email, password }) => {
  const { user } = await auth.signInWithEmailAndPassword(email, password);
  const userRef = await createUserProfileDoc(user);
  const userSnapshot = await userRef.get();

  return { id: userSnapshot.id, ...userSnapshot.data() };
};
