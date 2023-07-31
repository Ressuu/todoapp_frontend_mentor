import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcaFgej-eDFC4L_RdMGGJvxmHrylbKnxQ",
  authDomain: "todoapp-4a472.firebaseapp.com",
  projectId: "todoapp-4a472",
  storageBucket: "todoapp-4a472.appspot.com",
  messagingSenderId: "749324792249",
  appId: "1:749324792249:web:261d99bf4d6e6b633c8668",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//koniec firebase

let text = document.getElementById("todo-input");
function addItem(event) {
  event.preventDefault();
  const docRef = addDoc(collection(db, "To-do"), {
    text: text.value,
    status: "active",
  });
  console.log("Document written with ID: ", docRef.id);
}

text.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addItem(e);
  }
});
