import { getAuth, GoogleAuthProvider } from "firebase/auth"

import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "loginonecart-f1706.firebaseapp.com",
    projectId: "loginonecart-f1706",
    storageBucket: "loginonecart-f1706.firebasestorage.app",
    messagingSenderId: "566571255743",
    appId: "1:566571255743:web:1ec866365e98664999830a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const provider = new GoogleAuthProvider()


export { auth, provider }
