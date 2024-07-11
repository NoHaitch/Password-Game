import React from "react";
import { useNavigate } from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../config/firebase";
import Authentication from "./../components/Authentication";

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
      <div className="text-center">
        <h1 className="text-5xl font-title m-4 text-[#7188D9]">
          The Password Game
        </h1>
        <h2 className="text-xl text-white font-mono">
          inspired by the{"  "}
          <a href="https://neal.fun/password-game/" className="underline">
            original
          </a>
        </h2>
      </div>
      <div className="m-8">
        <Authentication />
      </div>
    </div>
  );
}

export default Home;
