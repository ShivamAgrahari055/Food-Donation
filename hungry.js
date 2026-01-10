import { db } from "./firebase.js";
import { collection, addDoc } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const reportBtn = document.getElementById("reportHungry");
const noteInput = document.getElementById("note"); // textarea/input
// make sure this ID exists in HTML

reportBtn.addEventListener("click", async () => {
  const note = noteInput.value.trim();

  if (!note) {
    alert("Please enter a message");
    return;
  }

  // get location (example)
  navigator.geolocation.getCurrentPosition(async pos => {
    const location = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    };

    await addDoc(collection(db, "hungry_reports"), {
      note,
      location,
      createdAt: Date.now()
    });

    alert("Report submitted successfully");
    noteInput.value = "";
  });
});
