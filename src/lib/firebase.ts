import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Allow anonymous sign-in for testing click tracking without requiring Google login
export const signIn = async () => {
  if (auth.currentUser) return auth.currentUser;
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error: any) {
    console.error("Firebase Auth Error:", error.code, error.message);
    if (error.code === 'auth/admin-restricted-operation') {
      console.warn("ACTION REQUIRED: You must enable 'Anonymous' authentication in your Firebase Console.");
    }
    throw error;
  }
};

export const trackAdClick = async (adId: string) => {
  try {
    await addDoc(collection(db, 'ad_clicks'), {
      adId,
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid
    });
  } catch (error) {
    console.error("Error tracking ad click:", error);
  }
};

export const trackDownload = async (url: string, platform: string) => {
  try {
    await addDoc(collection(db, 'downloads'), {
      url,
      platform,
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid
    });
  } catch (error) {
    console.error("Error tracking download:", error);
  }
};
