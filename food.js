import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { addDoc, collection } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) return;

    const addFoodBtn = document.getElementById("addFoodBtn");
    const qtyInput = document.getElementById("food_qty");
    const phoneInput = document.getElementById("food_phone");

    if (!addFoodBtn || !qtyInput || !phoneInput) return;

    addFoodBtn.addEventListener("click", () => {
      const quantity = qtyInput.value.trim();
      const phone = phoneInput.value.trim();
      
      if (!quantity || !phone) {
        alert("Please fill all fields");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        await addDoc(collection(db, "food_posts"), {
          quantity,
          phone,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          },
          status: "available",
          createdAt: Date.now(),
          createdBy: auth.currentUser.uid
        });

        alert("Food added successfully");
        qtyInput.value = "";
        phoneInput.value = "";
      });
    });
  });
});
