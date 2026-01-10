import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { addDoc, collection } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ✅ Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ food.js loaded");

  // ✅ Wait for auth
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("❌ User not logged in, food disabled");
      return;
    }

    console.log("✅ Auth user:", user.uid);

    const addFoodBtn = document.getElementById("addFoodBtn");
    const qtyInput = document.getElementById("food_qty");
    const phoneInput = document.getElementById("food_phone");

    // 🔴 HARD CHECK
    if (!addFoodBtn || !qtyInput || !phoneInput) {
      console.error("❌ Add food elements not found", {
        addFoodBtn,
        qtyInput,
        phoneInput
      });
      return;
    }

    console.log("✅ Add Food button found");

    // ✅ Attach click
    addFoodBtn.addEventListener("click", () => {
      console.log("🔥 Add Food clicked");

      const quantity = qtyInput.value.trim();
      const phone = phoneInput.value.trim();

      if (!quantity || !phone) {
        alert("Please fill all fields");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            await addDoc(collection(db, "food_posts"), {
              quantity,
              phone,
              location: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
              },
              status: "available",
              createdAt: Date.now(),
              createdBy: user.uid
            });

            alert("✅ Food added successfully");
            qtyInput.value = "";
            phoneInput.value = "";

          } catch (err) {
            console.error("❌ Firestore error:", err);
            alert(err.message);
          }
        },
        () => {
          alert("Location permission required");
        }
      );
    });
  });
});
