// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCB_v36i7e0rqKhDjmpiRNS-l57elUY7bA",
  authDomain: "film-abf73.firebaseapp.com",
  projectId: "film-abf73",
  storageBucket: "film-abf73.appspot.com",
  messagingSenderId: "897810208745",
  appId: "1:897810208745:web:0105b4175c0b3b0dc05d78",
  measurementId: "G-5T4VEFYXPB",
};

// Inicializa Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();

export default firebase;
