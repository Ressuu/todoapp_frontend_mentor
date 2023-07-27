import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

// Add Firebase products that you want to use
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAcaFgej-eDFC4L_RdMGGJvxmHrylbKnxQ",
  authDomain: "todoapp-4a472.firebaseapp.com",
  projectId: "todoapp-4a472",
  storageBucket: "todoapp-4a472.appspot.com",
  messagingSenderId: "749324792249",
  appId: "1:749324792249:web:8ae52bf95821cb543c8668",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

function addItem() {
  let text = document.getElementById("todo-input");
  setDoc(doc(db, "todo-items", text.value), {
    status: "active",
  });
}

window.addItem = addItem;
