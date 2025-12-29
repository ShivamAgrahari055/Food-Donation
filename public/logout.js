import { auth } from "../firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const btn = document.getElementById("logoutBtn");

if (btn) {
  btn.onclick = () => {
    signOut(auth)
      .then(() => {
        location.href = "index.html";
      })
      .catch(err => alert(err.message));
  };
}
