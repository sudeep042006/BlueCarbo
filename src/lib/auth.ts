// This file is machine-generated - edit at your own risk.

import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 

type UserType = 'ngo' | 'corporate' | 'admin';

export async function signUpWithEmail(email: string, password: string, name: string, userType: UserType) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user info in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: user.email,
      role: userType,
      createdAt: new Date()
    });

    return user;
  } catch (error: any) {
    // Provide more specific error messages
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('This email address is already in use.');
      case 'auth/invalid-email':
        throw new Error('The email address is not valid.');
      case 'auth/operation-not-allowed':
        throw new Error('Email/password accounts are not enabled.');
      case 'auth/weak-password':
        throw new Error('The password is too weak.');
      default:
        throw new Error('An unexpected error occurred during sign-up.');
    }
  }
}

export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
     // Provide more specific error messages
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        throw new Error('Invalid email or password.');
      case 'auth/invalid-email':
        throw new Error('The email address is not valid.');
      case 'auth/user-disabled':
        throw new Error('This user account has been disabled.');
      default:
        throw new Error('An unexpected error occurred during sign-in.');
    }
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw new Error('Failed to sign out.');
  }
}
