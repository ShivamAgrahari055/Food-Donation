import { auth, db } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import {
  doc, setDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

window.signupUser = function () {
  let email = s_email.value;
  let pass = s_pass.value;
  let role = s_role.value;
  let phone = s_phone.value;

  createUserWithEmailAndPassword(auth, email, pass)
    .then(res => {
      return setDoc(doc(db, "users", res.user.uid), {
        role,
        phone
      });
    })
    .then(() => {
      alert("Signup successful");
    })
    .catch(err => alert(err.message));
}

window.loginUser = function () {
  signInWithEmailAndPassword(auth, l_email.value, l_pass.value)
    .then(() => location.href = "dashboard.html")
    .catch(err => alert(err.message));
}
