/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBsB_jY5JAtfYmRUN1IN_2dLmT0g-2OPsQ",
    authDomain: "theplanner-fe2a0.firebaseapp.com",
    projectId: "theplanner-fe2a0",
    storageBucket: "theplanner-fe2a0.appspot.com",
    messagingSenderId: "909213032409",
    appId: "1:909213032409:web:2d1708bddb18f0234883c8",
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

