import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjPusB_sQbjyxI4DEolI4Pry6omeylmgs",
    authDomain: "scran-recipe-app-e4fb7.firebaseapp.com",
    databaseURL: "https://scran-recipe-app-e4fb7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "scran-recipe-app-e4fb7",
    storageBucket: "scran-recipe-app-e4fb7.appspot.com",
    messagingSenderId: "976669814346",
    appId: "1:976669814346:web:a621cb4701c8d9c87a00b3"
  };

  let app;

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  export const database = getDatabase(app);
  
  export default app;

