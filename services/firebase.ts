import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAGGXrkZ5Dr68aDqKW9xXRJt6qg736T3a0",
  authDomain: "tora-fe502.firebaseapp.com",
  projectId: "tora-fe502",
  storageBucket: "tora-fe502.firebasestorage.app",
  messagingSenderId: "571246536278",
  appId: "1:571246536278:web:0e8492dcaed9768d5e3df7",
  measurementId: "G-2J95MNYNY3"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
