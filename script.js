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
  query,
  writeBatch,
  where,
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
const clearCompleted = document.querySelector(".clear_completed");
const completedTask = document.querySelector(".Completed_tasks");
const allTasks = document.querySelector(".all_tasks");
const todoCollectionRef = collection(db, "To-do");
const activeTasks = document.querySelector(".active_tasks");
const itemsStatuses = document.querySelector(".items-statuses");
const spans = itemsStatuses.querySelectorAll("span");
const backgroundButton = document.querySelector(".background-btn");
let items = [];
let text = document.getElementById("todo-input");
let number = document.querySelector(".task_number");
let bodyElement = document.body;

function addItem(event) {
  event.preventDefault();
  const docRef = addDoc(collection(db, "To-do"), {
    text: text.value,
    status: "active",
  });
  console.log("Document written with ID: ", docRef.id);
  text.value = "";
  createEventListeners();
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
    <div class="todo-item ${
      bodyElement.classList.contains("body-light") ? "todo-item-light" : ""
    }">
        <div class="check">
          <div data-id="${item.id}" class="check-mark ${
      item.status == "completed" ? "checked" : ""
    } ${
      bodyElement.classList.contains("body-light") ? "check-mark-light" : ""
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

async function getTodoTask() {
  const querySnapshot = getDocs(todoCollectionRef);
  const numberOfDocuments = querySnapshot.size;
  return numberOfDocuments;
}

async function todoTaskNumber() {
  const querySnapshot = getDocs(todoCollectionRef);
  const numberOfDocuments = querySnapshot.size;
  return numberOfDocuments;
}

//funkcja ktory updatuje all i active text

function todoTasksNumber(count) {
  const taskNumberElement = document.querySelector(".task_number");

  if (count === 0) {
    taskNumberElement.innerHTML = "You have nothing to do";
  } else if (count === 1) {
    taskNumberElement.innerHTML = "You have 1 task";
  } else {
    taskNumberElement.innerHTML = `You have ${count} tasks`;
  }
}
//koniec

// funkcja do wyświetlania ilości zadań zakończonych

function todoTasksCompleted(count) {
  const taskNumberElement = document.querySelector(".task_number");

  if (count === 0) {
    taskNumberElement.innerHTML = "You don't have completed task's";
  } else if (count === 1) {
    taskNumberElement.innerHTML = "You have completed 1 task";
  } else {
    taskNumberElement.innerHTML = `You completed ${count} task's`;
  }
}

//koniec

function refreshTaskNumber() {
  onSnapshot(todoCollectionRef, (querySnapshot) => {
    const numberOfTasks = querySnapshot.size;
    todoTasksNumber(numberOfTasks);
  });
}

// Pobranie z bazy danych status active

async function getActiveItemsFromFirebase() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "To-do"), where("status", "==", "active"))
    );

    const activeItems = [];
    querySnapshot.forEach((doc) => {
      activeItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return activeItems;
  } catch (error) {
    console.error(querySnapshot);
    return [];
  }
}

activeTasks.addEventListener("click", async () => {
  const activeItems = await getActiveItemsFromFirebase();
  generateItems(activeItems);
  todoTasksNumber(activeItems.length);
});

// KONIEC

// Pobranie z bazy danych status all

async function getAllItemsFromFirebase() {
  try {
    const activeQuerySnapshot = await getDocs(
      query(collection(db, "To-do"), where("status", "==", "active"))
    );

    const completedQuerySnapshot = await getDocs(
      query(collection(db, "To-do"), where("status", "==", "completed"))
    );

    const activeItems = activeQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const completedItems = completedQuerySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const allItems = [...activeItems, ...completedItems];
    return allItems;
  } catch (error) {
    console.error("Błąd podczas pobierania danych z Firebase:", error);
    return [];
  }
}

allTasks.addEventListener("click", async () => {
  const allItems = await getAllItemsFromFirebase();
  generateItems(allItems);
  todoTasksNumber(allItems.length);
});

//Koniec

//Pobranie z bazy danych status completed

async function getCompletedItemsFromFirebase() {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "To-do"), where("status", "==", "completed"))
    );

    const activeItems = [];
    querySnapshot.forEach((doc) => {
      activeItems.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return activeItems;
  } catch (error) {
    console.error(querySnapshot);
  }
}

completedTask.addEventListener("click", async () => {
  const completedItems = await getCompletedItemsFromFirebase();
  generateItems(completedItems);
  todoTasksCompleted(completedItems.length);
});

//koniec

// Przekazywanie classy active pomiedzy All, Active i Completed

spans.forEach((span) => {
  span.addEventListener("click", function () {
    spans.forEach((s) => s.classList.remove("active"));
    span.classList.add("active");
  });
});

// KONIEC

// Usuwanie wszystkich zadań z statusu completed z bazy danych

async function deleteCompletedItemsFromFirebase() {
  const answer = prompt(
    "Do you wanna delete all completed tasks? Type 'yes' to delete it "
  );
  if (answer === "yes") {
    try {
      const completedQuerySnapshot = await getDocs(
        query(collection(db, "To-do"), where("status", "==", "completed"))
      );

      const batch = writeBatch(db);
      completedQuerySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log("Usunięto dokumenty ze statusem 'completed' z Firebase.");
    } catch (error) {
      console.error("Błąd podczas usuwania dokumentów:", error);
    }
  }
}

//koniec

clearCompleted.addEventListener("click", async () => {
  await deleteCompletedItemsFromFirebase();
  const allItems = await getAllItemsFromFirebase();
});

backgroundButton.addEventListener("click", () => {
  let title = document.querySelector(".title");
  let bodyElement = document.body;
  let newToDo = document.querySelector(".new-todo");
  let checkMark = document.querySelector(".check-mark");
  let todoitem = document.querySelector(".todo-item");
  let newDoToInput = document.querySelector(".new-doto-input");
  let toDoItemsWrapper = document.querySelector(".todo-items-wrapper");
  let background = document.querySelector(".backgroundIMG");
  let isBackgroundChanged = false;

  if (!isBackgroundChanged) {
    background.src = "./images/bg-desktop-light.jpg";
  } else {
    background.src = "./images/bg-desktop-dark.jpg";
  }
  isBackgroundChanged = !isBackgroundChanged;

  toDoItemsWrapper.classList.toggle("todo-items-wrapper-light");
  newDoToInput.classList.toggle("new-doto-input-light");
  todoitem.classList.toggle("todo-item-light");
  checkMark.classList.toggle("check-mark-light");
  newToDo.classList.toggle("new-todo-light");
  bodyElement.classList.toggle("body-light");
  title.classList.toggle("title-light");
});

listenToTodoChanges();
refreshTaskNumber();

getItems().then((items) => {
  generateItems(items);
});
