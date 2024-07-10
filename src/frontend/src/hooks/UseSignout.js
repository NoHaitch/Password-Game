import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

function UseSignOut() {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
}

export default UseSignOut;
