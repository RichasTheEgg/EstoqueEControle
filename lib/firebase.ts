import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyC6gCqV0pKSF5phsUwejPBWZxadZiSDPhQ",
  authDomain: "trabalhoiverson-7fd18.firebaseapp.com",
  projectId: "trabalhoiverson-7fd18",
  storageBucket: "trabalhoiverson-7fd18.firebasestorage.app",
  messagingSenderId: "913805652641",
  appId: "1:913805652641:web:7e22d9db6f4663d4ae36e0",
  measurementId: "G-G0Z5NSJLKX"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
