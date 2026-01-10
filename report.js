import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc } from
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const reportBtn = document.getElementById("reportHungry");
  const noteInput = document.getElementById("note");
  const reportList = document.getElementById("reportList");

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    // 🔹 get role
    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) return;

    const role = userSnap.data().role;

    // ❌ admin cannot report
    if (role === "admin") {
      if (reportBtn) reportBtn.style.display = "none";
      return;
    }

    // ✅ provider + receiver BOTH can report
    reportBtn.addEventListener("click", async () => {
      const note = noteInput.value.trim();
      if (!note) {
        alert("Please! Write Your Report..");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        await addDoc(collection(db, "hungry_reports"), {
          note,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          },
          createdAt: Date.now(),
          createdBy: user.uid,
          role: role
        });

        alert("✅ Report submitted");
        noteInput.value = "";
        loadReports();
      });
    });

    // 🔹 load reports
    async function loadReports() {
      if (!reportList) return;

      const snap = await getDocs(collection(db, "hungry_reports"));
      reportList.innerHTML = "";

      snap.forEach(docSnap => {
        const d = docSnap.data();

        const div = document.createElement("div");
        div.className = "report-card";
        div.innerHTML = `
          <p>${d.note}</p>
          ${d.createdBy === user.uid
            ? `<button class="resolve">Mark Helped</button>`
            : ""}
        `;

        if (d.createdBy === user.uid) {
          div.querySelector(".resolve").addEventListener("click", async () => {
            await deleteDoc(doc(db, "hungry_reports", docSnap.id));
            loadReports();
          });
        }

        reportList.appendChild(div);
      });
    }

    loadReports();
  });
});