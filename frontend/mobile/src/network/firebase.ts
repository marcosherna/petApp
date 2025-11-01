import { getFirestore } from "firebase/firestore";
import { app } from "../../firebaseConfig";

export const database = getFirestore(app);

