import { app } from "../../firebaseConfig";
import { getFirestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";
// Use standard auth module with AsyncStorage persistence
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const database = getFirestore(app);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const storage = getStorage(app);
