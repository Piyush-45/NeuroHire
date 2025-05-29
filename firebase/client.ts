import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyA_hyNH5_u8aGahZeMkkef59jex6DFNfd8",
    authDomain: "aiinterviewprep-44dd4.firebaseapp.com",
    projectId: "aiinterviewprep-44dd4",
    storageBucket: "aiinterviewprep-44dd4.firebasestorage.app",
    messagingSenderId: "836997602832",
    appId: "1:836997602832:web:84e2daca977ae037423495",
    measurementId: "G-0VDWZDW6GC"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);