// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDd8Y6-vhnAMkdTXs8GxdaARIlNEN-_dvs",
  authDomain: "redsocialsegundo.firebaseapp.com",
  projectId: "redsocialsegundo",
  storageBucket: "redsocialsegundo.appspot.com",
  messagingSenderId: "1014808107007",
  appId: "1:1014808107007:web:4cb3603986d4968ea779ca"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);


export const db = getFirestore(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

