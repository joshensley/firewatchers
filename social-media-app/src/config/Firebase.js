import firebase from 'firebase';
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDtl4Uanbhdkk1DSwN9RmGIaLVmBaJtbEA",
    authDomain: "firewatchers.firebaseapp.com",
    databaseURL: "https://firewatchers.firebaseio.com",
    projectId: "firewatchers",
    storageBucket: "firewatchers.appspot.com",
    messagingSenderId: "536429620512",
    appId: "1:536429620512:web:4d8e614b630d20bea4bb45",
    measurementId: "G-VP371LMKX2"
  };
  // Initialize Firebase
//const fire = firebase.initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);

//export default fire;
export default firebase;

