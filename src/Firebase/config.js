import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBOqaaz41TgACmx9Qp3YLx2rlMHG7qyu5I",
    authDomain: "recepies-23882.firebaseapp.com",
    projectId: "recepies-23882",
    storageBucket: "recepies-23882.firebasestorage.app",
    messagingSenderId: "734058599760",
    appId: "1:734058599760:web:f556aea4c5a63035328855"
  };

// hada li ltht dyal alae  
// const firebaseConfig = {
//     apiKey: "AIzaSyAmhPGNG_RldYdJtXtLsyQoMXDLP5GOLAg",
//     authDomain: "projet-quiz-3d699.firebaseapp.com",
//     projectId: "projet-quiz-3d699",
//     storageBucket: "projet-quiz-3d699.firebasestorage.app",
//     messagingSenderId: "236163468988",
//     appId: "1:236163468988:web:ba134f4638d1f0e72f0ab9"
// };

firebase.initializeApp(firebaseConfig);
const app = firebase.firestore();
const auth = firebase.auth();

export { app, auth };
