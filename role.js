import { auth, db } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  const snap = await getDoc(doc(db, "users", user.uid));
  const role = snap.data().role;

  roleTitle.innerText = "Logged in as: " + role;

  providerBox.style.display = role === "provider" ? "block" : "none";
  receiverBox.style.display = role === "receiver" ? "block" : "none";
});
