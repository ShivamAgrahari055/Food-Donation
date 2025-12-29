import { auth,db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let userLat = null;
let userLng = null;

/* 🔹 Get user location FIRST */
navigator.geolocation.getCurrentPosition(
  pos => {
    userLat = pos.coords.latitude;
    userLng = pos.coords.longitude;
    startReceiverListener();
  },
  err => {
    alert("Location access is required to find nearby food");
  }
);

/* 🔹 Distance Formula */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* 🔹 Provider Adds Food */
window.addFood = function () {
  if (!userLat || !userLng) {
    alert("Location not available");
    return;
  }

  addDoc(collection(db, "food_posts"), {
    quantity: food_qty.value,
    phone: food_phone.value,
    location: { lat: userLat, lng: userLng },
    time: serverTimestamp()
  }).then(() => alert("Food added successfully"));
};

/* 🔹 Receiver View Nearby Food */
function startReceiverListener() {
  if (!window.foodList) return;

  onSnapshot(collection(db, "food_posts"), snap => {
    foodList.innerHTML = "";

    snap.forEach(doc => {
      const d = doc.data();
      const dist = getDistance(
        userLat,
        userLng,
        d.location.lat,
        d.location.lng
      );

      if (dist <= 5) {
        const li = document.createElement("li");
        li.innerText = `🍱 ${d.quantity} | 📞 ${d.phone} | ${dist.toFixed(2)} km`;
        foodList.appendChild(li);
      }
    });
  });
}
