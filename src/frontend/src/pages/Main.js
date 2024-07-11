import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineLeaderboard } from "react-icons/md";
import { LuHistory } from "react-icons/lu";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { twMerge } from "tailwind-merge";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../config/firebase";
import Title from "../components/Title";
import PasswordField from "../components/PasswordField";
import ConstraintBlock from "../components/ConstraintBlock";

function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [playing, setPlaying] = useState(false);
  const [difficultyStyle, setDifficultyStyle] = useState("");
  const [difficulty, setDifficulty] = useState("None");

  useEffect(() => {
    const authenticated = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        navigate("/");
      }
    });

    return () => authenticated();
  }, [navigate]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <img
          className="w-20 h-20 animate-spin"
          src="https://www.svgrepo.com/show/70469/loading.svg"
          alt="Loading icon"
        />
      </div>
    );
  }

  return (
    <div className="w-screen">
      <div className="">
        <aside
          id="sidebar-multi-level-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform text-gray-400 "
          aria-label="Sidebar"
        >
          <div className="h-full px-3 py-4 overflow-y-auto bg-[#1E1F20] flex flex-col justify-between items-center">
            <ul className="flex flex-col justify-between items-center space-y-3 mt-4">
              <li className="flex flex-row items-center">{user?.email}</li>
              <li className="flex flex-row items-center">Highscore:</li>
              <li className="flex flex-row items-center">
                <button className="text-gray-400" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
            <ul className="flex flex-col justify-between items-center space-y-4 mt-4 text-white">
              <li>
                Difficulty :{" "}
                <span className={twMerge("font-bold", difficultyStyle)}>
                  {difficulty}
                </span>
              </li>
              <li className="m-4">Current time</li>
              <li className="flex flex-col justify-center items-center">
                <div>
                  <button
                    type="button"
                    className="focus:outline-none text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 focus:ring-yellow-900"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-red-600 hover:bg-red-700 focus:ring-red-900"
                  >
                    Load
                  </button>
                </div>
                <button
                  type="button"
                  className="focus:outline-none text-white focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-green-600 hover:bg-green-700 focus:ring-green-800"
                >
                  New Game
                </button>
              </li>
            </ul>
            <ul>
              <li className="flex flex-row items-center">
                <MdOutlineLeaderboard className="m-2 size-6" /> Leaderboard
              </li>
              <li className="flex flex-row items-center">
                <LuHistory className="m-2 size-6" /> History
              </li>
              <li className="flex flex-row items-center">
                <IoIosInformationCircleOutline className="m-2 size-6" /> About
              </li>
            </ul>
          </div>
        </aside>
      </div>
      <div className="flex flex-col justify-center items-center pl-64 w-screen mt-4">
        <Title />
        {!playing ? (
          <div className="text-gray-400 text-center m-4">
            <h1>No Game started.</h1>
            <h1>Use the button on the sidebar to load or start a new game.</h1>
          </div>
        ) : (
          <>
            <PasswordField />
            <ConstraintBlock ruleNumber="15" state="false" />
            <ConstraintBlock ruleNumber="14" state="false" />
            <ConstraintBlock ruleNumber="2" state="true" />
            <ConstraintBlock ruleNumber="1" state="true" />
            <ConstraintBlock ruleNumber="1" state="true" />
            <ConstraintBlock ruleNumber="1" state="true" />
            <ConstraintBlock ruleNumber="1" state="true" />
            <ConstraintBlock ruleNumber="1" state="true" />
          </>
        )}
      </div>
    </div>
  );
}

export default Main;
