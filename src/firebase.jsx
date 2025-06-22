import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyBEM21Gnlysp2pPiZFhSnn3xMhb5EpTjGs",
  authDomain: "chat-application-dee4e.firebaseapp.com",
  projectId: "chat-application-dee4e",
  storageBucket: "chat-application-dee4e.appspot.com", // ✅ Make sure this ends in `.appspot.com`
  messagingSenderId: "752482373708",
  appId: "1:752482373708:web:578d1dc27b282dd7d5e4e9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Create a storage instance

export { auth, db, storage }; // ✅ Export it
