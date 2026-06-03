import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbJEJblEQqnXTlw6LimvDarH1s41Bxx0s",

  authDomain: "viva-cricket.firebaseapp.com",

  projectId: "viva-cricket",

  storageBucket: "viva-cricket.firebasestorage.app",

  messagingSenderId: "29473010976",

  appId:
    "1:29473010976:web:993c84f4d264e188b59345",

  measurementId: "G-GPETGW9481",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);