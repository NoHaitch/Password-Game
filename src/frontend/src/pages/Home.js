import React from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../config/firebase";
import Authentication from "./../components/Authentication";
import Title from "../components/Title";

function Home() {
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/main");
    }
  });

  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="w-screen h-screen bg-[url('../public/background.jpg')] absolute top-0 left-0 -z-10 opacity-25"></div>
      <Title />
      <div className="m-8">
        <Authentication />
      </div>
    </div>
  );
}

export default Home;
