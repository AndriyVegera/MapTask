import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAompkG1wfH9FrKRWl5qER5ts9_XLSeMPw",
    authDomain: "my-maps-project-5b675.firebaseapp.com",
    projectId: "my-maps-project-5b675",
    storageBucket: "my-maps-project-5b675.appspot.com",
    messagingSenderId: "596137157758",
    appId: "1:596137157758:web:b553a160752c371ce6642f",
    measurementId: "G-9ZNJPKMS2P"
};

export const app = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
