import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const roleTitle = document.getElementById("roleTitle");
const providerBox = document.getElementById("providerBox");
const receiverBox = document.getElementById("receiverBox");
const adminBox = document.getElementById("adminBox");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  try {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    // 🔥 IMPORTANT: user doc may not exist
    if (!snap.exists()) {
      console.warn("User document missing");
      roleTitle.innerText = "Logged in";
      return;
    }

    const role = snap.data().role;

    roleTitle.innerText = "Logged in as: " + role;

    providerBox.style.display = "none";
    receiverBox.style.display = "none";
    adminBox.style.display = "none";

    if (role === "provider") providerBox.style.display = "block";
    if (role === "receiver") receiverBox.style.display = "block";
    if (role === "admin") adminBox.style.display = "block";

  } catch (err) {
    console.error("Role load error:", err);
    // ❌ NO alert — don't break app
    roleTitle.innerText = "Logged in";
  }
});