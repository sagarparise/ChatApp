
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBK_FGkbAu-kgCDRVtArXFdtFhx4vg98Yc",
  authDomain: "chatapp-f643e.firebaseapp.com",
  databaseURL: "https://chatapp-f643e-default-rtdb.firebaseio.com",
  projectId: "chatapp-f643e",
  storageBucket: "chatapp-f643e.appspot.com",
  messagingSenderId: "812199822406",
  appId: "1:812199822406:web:2182abf583263a3a24b647",
  databaseURL: 'https://chatapp-f643e-default-rtdb.firebaseio.com/'
  
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);

export default app;