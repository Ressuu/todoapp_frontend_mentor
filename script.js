import { db } from "/firebase.js";

function addItem(event) {
  console.log(event);
  let text = document.getElementById("todo-input");

  try {
    const docRef = addDoc(collection(db, "todo-items"), {
      text: text.value,
      status: "active",
    });
    console.log("Document written with ID: ", docRef.text);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
