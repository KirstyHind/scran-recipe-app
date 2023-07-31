// Firebase core libraries
import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Initialise Firebase
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

// Check if Firebase app has already been initialized
if (!getApps().length) {
  // If not initialized, initialize it with the configuration
  app = initializeApp(firebaseConfig);
} else {
  // If already initialized, use the existing app
  app = getApp();
}

// Get a reference to the database service
export const database = getDatabase(app);

// Export the Firebase app
export default app;
