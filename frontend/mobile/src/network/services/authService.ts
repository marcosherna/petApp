import {
  getAuth,
  createUserWithEmailAndPassword, 
  updateProfile,
  User,
} from "firebase/auth"; 
import { app } from "../../../firebaseConfig";

const auth = getAuth(app);

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;
  await updateProfile(user, { displayName: name }); 
  return user;
};

