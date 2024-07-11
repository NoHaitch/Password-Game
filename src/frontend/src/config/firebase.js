import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBPtM9IQSbQl48j-NZ-DoG6sxoeOFNB_UU",
  authDomain: "password-game-468aa.firebaseapp.com",
  projectId: "password-game-468aa",
  storageBucket: "password-game-468aa.appspot.com",
  messagingSenderId: "11873437179",
  appId: "1:11873437179:web:c6181edfc3a9ec7337775e",
  measurementId: "G-WSFTFSH1BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();