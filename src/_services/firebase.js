// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from 'firebase/app';

// Add the Firebase services that you want to use
// We only want to use Firebase Auth here
import 'firebase/auth';
import 'firebase/firestore';

// Your app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLOW8QedKhRJnqKt5yxietQAbRFfOuAxo",
    authDomain: "react-redux-login-app.firebaseapp.com",
    databaseURL: "https://react-redux-login-app.firebaseio.com",
    projectId: "react-redux-login-app",
    storageBucket: "react-redux-login-app.appspot.com",
    messagingSenderId: "64945004156",
    appId: "1:64945004156:web:dcacaadbfb9771c8bb73f9"
};
// Initialize Firebase
//firebase.initializeApp(firebaseConfig);

// Finally, export it to use it throughout your app
export default firebase.initializeApp(firebaseConfig);