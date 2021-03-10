import firebase from 'firebase'
require('@firebase/firestore')


var firebaseConfig = {
    apiKey: "AIzaSyChdKrUvfOZgUCmRK4R6IHb4F9XFAsX1ug",
    authDomain: "wily-a2b3d.firebaseapp.com",
    projectId: "wily-a2b3d",
    storageBucket: "wily-a2b3d.appspot.com",
    messagingSenderId: "1049089104078",
    appId: "1:1049089104078:web:83672cb8ca100fd8da189f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  

  export default firebase.firestore()