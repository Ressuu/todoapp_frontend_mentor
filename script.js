import firebase from "firebase/app";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcaFgej-eDFC4L_RdMGGJvxmHrylbKnxQ",
  authDomain: "todoapp-4a472.firebaseapp.com",
  projectId: "todoapp-4a472",
  storageBucket: "todoapp-4a472.appspot.com",
  messagingSenderId: "749324792249",
  appId: "1:749324792249:web:be022d06eb46cb623c8668",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");
  db.collection("todo-items").add({
    text: text.value,
    status: "active",
  });
}
