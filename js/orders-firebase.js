import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig), db=getFirestore(app);
window.submitServiceOrder = async function(payload){
  const doc={...payload,status:'new',source:'website',createdAt:serverTimestamp()};
  const ref=await addDoc(collection(db,'orders'),doc);
  localStorage.setItem('lastOrderId',ref.id);
  return ref.id;
};
