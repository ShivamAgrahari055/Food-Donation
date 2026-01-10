import { auth, db } from "./firebase.js";
import { collection, onSnapshot } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* 🗺 MAP INIT */
const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

/* 📦 MARKER STORAGE */
let foodMarkers = [];
let hungryMarkers = [];

/* 📊 LIVE COUNTERS */
const infoBox = L.control({ position: "topright" });
infoBox.onAdd = function () {
  const div = L.DomUtil.create("div", "info-box");
  div.innerHTML = `
    <h4>📊 Live Stats</h4>
    <p>🍱 Food Available: <span id="foodCount">0</span></p>
    <p>🚨 Hungry Reports: <span id="hungryCount">0</span></p>
  `;
  return div;
};
infoBox.addTo(map);

/* 📍 USER LOCATION */
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    map.setView([latitude, longitude], 13);

    L.circleMarker([latitude, longitude], {
      radius: 8,
      color: "#2563eb",
      fillOpacity: 0.9
    })
      .addTo(map)
      .bindPopup("📍 <b>You are here</b>");
  });
}

/* 🍱 FOOD ICON */
const foodIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046857.png",
  iconSize: [35, 35]
});

/* 🍱 FOOD POSTS */
onSnapshot(collection(db, "food_posts"), snapshot => {
  foodMarkers.forEach(m => map.removeLayer(m));
  foodMarkers = [];

  document.getElementById("foodCount").innerText = snapshot.size;

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.location) return;

    const marker = L.marker(
      [d.location.lat, d.location.lng],
      { icon: foodIcon }
    )
      .addTo(map)
      .bindPopup(`
        <div style="min-width:200px">
          <h4>🍱 Food Available</h4>
          <b>Quantity:</b> ${d.quantity || "N/A"}<br>
          <b>Contact:</b> ${d.phone || "Not provided"}<br>
          <span style="color:green;font-weight:bold">● Available</span>
        </div>
      `);

    foodMarkers.push(marker);
  });
});

/* 🚨 HUNGRY REPORTS (PULSING EFFECT) */
onSnapshot(collection(db, "hungry_reports"), snapshot => {
  hungryMarkers.forEach(m => map.removeLayer(m));
  hungryMarkers = [];

  document.getElementById("hungryCount").innerText = snapshot.size;

  snapshot.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.location) return;

    const marker = L.circleMarker(
      [d.location.lat, d.location.lng],
      {
        radius: 10,
        color: "red",
        fillColor: "red",
        fillOpacity: 0.6
      }
    )
      .addTo(map)
      .bindPopup(`
        <div style="min-width:200px">
          <h4>🚨 Hungry Person</h4>
          <p>${d.note || "Needs food urgently"}</p>
          <span style="color:red;font-weight:bold">● Urgent</span>
        </div>
      `);

    hungryMarkers.push(marker);
  });
});

/* 🧭 FIT ALL MARKERS BUTTON */
const fitBtn = L.control({ position: "bottomright" });
fitBtn.onAdd = function () {
  const btn = L.DomUtil.create("button", "fit-btn");
  btn.innerHTML = "🔍 Show All";
  btn.onclick = () => {
    const group = L.featureGroup([...foodMarkers, ...hungryMarkers]);
    if (group.getLayers().length) {
      map.fitBounds(group.getBounds().pad(0.2));
    }
  };
  return btn;
};
fitBtn.addTo(map);

/* 🗂 LEGEND */
const legend = L.control({ position: "bottomleft" });
legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
  
    <p>🍱 Food Available</p>
    <p style="color:red">● Hungry Person</p>
    <p style="color:blue">● You</p>
  `;
  return div;
};
legend.addTo(map);
