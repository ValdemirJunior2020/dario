// src/firebase.js
// Firebase v9+ modular setup with safe analytics init

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported as analyticsIsSupported } from "firebase/analytics";

// === YOUR CONFIG (from your message) ===
const firebaseConfig = {
  apiKey: "AIzaSyDkTthwGyppE_4V5BkKREMsa_Vgz4WH0Ow",
  authDomain: "agents-name.firebaseapp.com",
  projectId: "agents-name",
  // NOTE: Storage bucket names are typically "<project-id>.appspot.com".
  // You provided "agents-name.firebasestorage.app". If uploads ever fail,
  // check Firebase Console > Storage > Bucket, and use that exact value.
  storageBucket: "agents-name.firebasestorage.app",
  messagingSenderId: "880994939187",
  appId: "1:880994939187:web:eadb11e0f0299c58da0e46",
  measurementId: "G-ZDN3HSC82K",
};

// Initialize core services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics safely (only in browser, HTTPS, supported env)
let analytics = null;
analyticsIsSupported()
  .then((ok) => {
    if (ok) analytics = getAnalytics(app);
  })
  .catch(() => {
    // ignore analytics errors in dev/SSR
  });

export { app, db, storage, analytics };
