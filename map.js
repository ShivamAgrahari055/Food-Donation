import { auth, db } from "./firebase.js";
import { collection, onSnapshot, deleteDoc, doc } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// 🗺 Map init (tumhara existing code agar alag ho to rehne do)
const map = L.map("map").setView([20.5937, 78.9629], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

let foodMarkers = [];

// 🍱 FOOD POSTS LISTENER
onSnapshot(collection(db, "food_posts"), (snapshot) => {
  // 🔄 old markers hatao
  foodMarkers.forEach(m => map.removeLayer(m));
  foodMarkers = [];

  snapshot.forEach(docSnap => {
    const food = docSnap.data();
    const foodId = docSnap.id;

    // 🛑 safety checks (VERY IMPORTANT)
    if (!food.location || food.location.lat == null || food.location.lng == null) {
      return;
    }

    const quantity = food.quantity ?? "N/A";
    const phone = food.phone ?? "Not shared";

    // 🧾 popup content
    const popupDiv = document.createElement("div");
    popupDiv.innerHTML = `
      <h4>🍱 Food Available</h4>
      👥 People: ${quantity}<br>
      📞 Phone: ${phone}
    `;

    // ❌ Remove button sirf owner ke liye
    if (auth.currentUser && food.createdBy === auth.currentUser.uid) {
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove Food";
      removeBtn.style.marginTop = "6px";

      removeBtn.addEventListener("click", async () => {
        if (!confirm("Remove this food item?")) return;
        await deleteDoc(doc(db, "food_posts", foodId));
        alert("Food removed");
      });

      popupDiv.appendChild(removeBtn);
    }

    // 📍 marker
    const marker = L.marker([food.location.lat, food.location.lng])
      .addTo(map)
      .bindPopup(popupDiv);

    foodMarkers.push(marker);
  });
});
