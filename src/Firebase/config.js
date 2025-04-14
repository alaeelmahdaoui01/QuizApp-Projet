import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAmhPGNG_RldYdJtXtLsyQoMXDLP5GOLAg",
    authDomain: "projet-quiz-3d699.firebaseapp.com",
    projectId: "projet-quiz-3d699",
    storageBucket: "projet-quiz-3d699.firebasestorage.app",
    messagingSenderId: "236163468988",
    appId: "1:236163468988:web:ba134f4638d1f0e72f0ab9"
};

firebase.initializeApp(firebaseConfig);
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

export { projectFirestore as db, projectAuth };  // export db as projectFirestore
