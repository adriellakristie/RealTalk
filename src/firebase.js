import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcnfzfIP_WNEO2EZ2kMVvrFxvZu9_-2_w",
  authDomain: "realtalk-bbd55.firebaseapp.com",
  projectId: "realtalk-bbd55",
  storageBucket: "realtalk-bbd55.firebasestorage.app",
  messagingSenderId: "569985069203",
  appId: "1:569985069203:web:f074d01f3b3985b95b9d66",
  measurementId: "G-6HGH14F49V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, analytics, db };
