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

  const [resetConfirmation, setResetConfirmation] = useState(false);
  const [newGameDialog, setNewGameDialog] = useState(false);
  const [saveGameDialog, setSaveGameDialog] = useState(false);
  const [loadGameDialog, setLoadGameDialog] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [difficultyStyle, setDifficultyStyle] = useState("");
  const [difficulty, setDifficulty] = useState("None");
  const [newDifficulty, setNewDifficulty] = useState("");
  const [newDifficultyStyle, setNewDifficultyStyle] = useState("");

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
                    onClick={() => setSaveGameDialog(true)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-red-600 hover:bg-red-700 focus:ring-red-900"
                    onClick={() => setLoadGameDialog(true)}
                  >
                    Load
                  </button>
                </div>
                <button
                  type="button"
                  className="focus:outline-none text-white focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-green-600 hover:bg-green-700 focus:ring-green-800"
                  onClick={() => setNewGameDialog(true)}
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
        {newGameDialog ? (
          <div className="absolute flex top-0 px-32 w-full h-screen justify-center items-center">
            <div className="w-full h-full bg-black opacity-45"></div>
            <div className="absolute w-[400px] h-[150px] bg-[#1E1F20] rounded-md flex flex-col items-center p-2 text-white">
              <h1 className="mt-4">Choose a difficulty</h1>
              <div className="flex flex-row m-4">
                <button
                  type="button"
                  className="text-black bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-800 shadow-lg shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => {
                    setNewGameDialog(false);
                    if (playing) {
                      setResetConfirmation(true);
                      setNewDifficulty("Easy");
                      setNewDifficultyStyle("text-green-400");
                    } else {
                      setPlaying(true);
                      setDifficulty("Easy");
                      setDifficultyStyle("text-green-400");
                    }
                  }}
                >
                  Easy
                </button>
                <button
                  type="button"
                  className="text-black bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-lime-800 shadow-lg shadow-lime-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => {
                    setNewGameDialog(false);
                    if (playing) {
                      setResetConfirmation(true);
                      setNewDifficulty("Medium");
                      setNewDifficultyStyle("text-blue-400");
                    } else {
                      setPlaying(true);
                      setDifficulty("Medium");
                      setDifficultyStyle("text-blue-400");
                    }
                  }}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className="text-black bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-800 shadow-lg shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => {
                    setNewGameDialog(false);
                    if (playing) {
                      setResetConfirmation(true);
                      setNewDifficulty("Hard");
                      setNewDifficultyStyle("text-red-400");
                    } else {
                      setPlaying(true);
                      setDifficulty("Hard");
                      setDifficultyStyle("text-red-400");
                    }
                  }}
                >
                  Hard
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {resetConfirmation ? (
          <div className="absolute flex top-0 px-32 w-full h-screen justify-center items-center">
            <div className="w-full h-full bg-black opacity-45"></div>
            <div className="absolute w-[400px] h-[150px] bg-[#1E1F20] rounded-md flex flex-col items-center p-2 text-white">
              <div className="mt-4 text-center">
                <h1>You are currently playing.</h1>
                <h1>All current progress will disapear!</h1>
              </div>
              <div className="flex flex-row m-4">
                <button
                  type="button"
                  className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  onClick={() => {
                    setNewGameDialog(false);
                    setLoadGameDialog(false);
                    setResetConfirmation(false);
                    setDifficulty(newDifficulty);
                    setDifficultyStyle(newDifficultyStyle);
                  }}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  onClick={() => {
                    setNewGameDialog(false);
                    setLoadGameDialog(false);
                    setResetConfirmation(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}

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
