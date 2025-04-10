import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

// Cấu hình Firebase từ Firebase Console (chọn Web App)
const firebaseConfig = {
  apiKey: 'AIzaSyAbuSzdHCFCLQWjP1tRpEg9FAUCYit2I6U',
  authDomain: 'lab7-cro102-590d2.firebaseapp.com',
  projectId: 'lab7-cro102-590d2',
  storageBucket: 'lab7-cro102-590d2.firebasestorage.app',
  messagingSenderId: '120719724876',
  appId: '1:120719724876:web:afb23017fac0799ecdffe9',
  measurementId: 'G-FWL9H4QCKE',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error(error);
  }
};
