import { auth, db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let foodMarkers = [];
let hungryMarkers = [];

navigator.geolocation.getCurrentPosition(pos => {
  map.setView([pos.coords.latitude, pos.coords.longitude], 13);
});

/* 🍱 Food Markers */
onSnapshot(collection(db, "food_posts"), snap => {
  foodMarkers.forEach(m => map.removeLayer(m));
  foodMarkers = [];

  snap.forEach(doc => {
    const d = doc.data();
    const marker = L.marker([d.location.lat, d.location.lng])
      .addTo(map)
      .bindPopup(`🍱 ${d.quantity}<br>📞 ${d.phone}`);

    foodMarkers.push(marker);
  });
});

/* 🚨 Hungry Markers */
onSnapshot(collection(db, "hungry_reports"), snap => {
  hungryMarkers.forEach(m => map.removeLayer(m));
  hungryMarkers = [];

  snap.forEach(doc => {
    const d = doc.data();
    const marker = L.circleMarker(
      [d.location.lat, d.location.lng],
      { color: "red", radius: 8 }
    )
      .addTo(map)
      .bindPopup(`😔 Hungry Person<br>${d.note}`);

    hungryMarkers.push(marker);
  });
});
