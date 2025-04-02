// constants/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//capstonejnuapp@gmail.com의 firebase capstone-jnu-app 계정으로 테스트 중
const firebaseConfig = {
    apiKey: "AIzaSyBcQ-ihyPXZoQ8b35aW3wuScU6jnrbK018",
    authDomain: "capstone-jnu-app-49693.firebaseapp.com",
    projectId: "capstone-jnu-app-49693",
    storageBucket: "capstone-jnu-app-49693.firebasestorage.app",
    messagingSenderId: "545713526438",
    appId: "1:545713526438:web:6314e3ff980a8bca368667",
    measurementId: "G-C6DJ497Q9N",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
