import { auth, db } from '../firebase.js';
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

window.reportHungry = function () {
  navigator.geolocation.getCurrentPosition(pos => {
    addDoc(collection(db, "hungry_reports"), {
      note: note.value,
      location: {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      },
      time: serverTimestamp()
    }).then(() => alert("Reported Successfully"));
  });
}
