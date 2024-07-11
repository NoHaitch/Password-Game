import React from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../config/firebase";

function Main() {
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/");
    } else {
      console.log(auth?.currentUser?.email);
    }
  });

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <button className="text-gray-400" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Main;
