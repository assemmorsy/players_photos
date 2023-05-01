import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDgsa29WM-ZmThITRj2X1ROpFheva-0F5w",
  authDomain: "players-photos.firebaseapp.com",
  projectId: "players-photos",
  storageBucket: "players-photos.appspot.com",
  messagingSenderId: "892416100729",
  appId: "1:892416100729:web:4d816ea75c6b07ac3547a8",
};

firebase.initializeApp(firebaseConfig);
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectAuth, projectStorage, projectFirestore, timestamp };
