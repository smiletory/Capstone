// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeFirestore } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { ref, set } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcQ-ihyPXZoQ8b35aW3wuScU6jnrbK018",
  authDomain: "capstone-jnu-app-49693.firebaseapp.com",
  projectId: "capstone-jnu-app-49693",
  storageBucket: "capstone-jnu-app-49693.firebasestorage.app",
  messagingSenderId: "545713526438",
  appId: "1:545713526438:web:6314e3ff980a8bca368667",
  measurementId: "G-C6DJ497Q9N"
};

const PostButton = ({text}) => {
    const onPress = () => {
        const date = new Date();
        postTestData(Date.now(), date.toLocaleDateString());
    }
    const postTestData = (key, value) => {
        set(ref(database, 'test/' + key.toString()), value);
    }
    return(
        <TouchableOpacity onpress={onPress}>
            <Container>
                <InnerText>{text}</InnerText>
            </Container>
        </TouchableOpacity>
    )
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
  });
export { app, analytics, db };