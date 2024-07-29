import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const FirebaseConfig = {
  apiKey: "AIzaSyDcUKL112DXuSviehPr-seychvX5Tm3F-Y",
  authDomain: "misumi-c9190.firebaseapp.com",
  projectId: "misumi-c9190",
  storageBucket: "misumi-c9190.appspot.com",
  messagingSenderId: "233067830913",
  appId: "1:233067830913:web:8eb379fde010c1eda0f780",
};

const app = initializeApp(FirebaseConfig);

const db = getFirestore(app);
const realtimeDb = getDatabase(app);
const auth = getAuth(app);
export { app, db, auth, realtimeDb };
