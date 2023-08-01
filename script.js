import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  addDoc,
  onSnapshot,
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

let items = [];
let text = document.getElementById("todo-input");
const todoCollectionRef = collection(db, "To-do");

function addItem(event) {
  event.preventDefault();
  const docRef = addDoc(collection(db, "To-do"), {
    text: text.value,
    status: "active",
  });
  console.log("Document written with ID: ", docRef.id);
  text.value = "";
}

text.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addItem(e);
  }
});

async function getItems() {
  const querySnapshot = await getDocs(collection(db, "To-do"));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return items;
}

function generateItems(items) {
  let itemsHTML = "";
  items.forEach((item) => {
    itemsHTML += `
      <div class="todo-item">
        <div class="check">
          <div data-id="${item.id}" class="check-mark ${
      item.status == "completed" ? "checked" : ""
    }">
            <img src="/images/icon-check.svg" alt="" />
          </div>
        </div>
        <div class="todo-text ${item.status == "completed" ? "checked" : ""}">
          ${item.text}
        </div>
      </div>   
    `;
  });

  document.querySelector(".todo-items").innerHTML = itemsHTML;
  createEventListeners();
}

function createEventListeners() {
  let toDoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
  toDoCheckMarks.forEach((checkMark) => {
    checkMark.addEventListener("click", function () {
      markCompleted(checkMark.dataset.id);
    });
  });
}
async function markCompleted(id) {
  const itemRef = doc(db, "To-do", id);
  const itemSnapshot = await getDoc(itemRef);
  const itemData = itemSnapshot.data();

  if (itemData.status === "completed") {
    await updateDoc(itemRef, { status: "active" });
  } else {
    await updateDoc(itemRef, { status: "completed" });
  }
}

function listenToTodoChanges() {
  onSnapshot(todoCollectionRef, (querySnapshot) => {
    const items = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    generateItems(items);
  });
}

listenToTodoChanges();

getItems().then((items) => {
  generateItems(items);
});
