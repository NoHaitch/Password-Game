import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineLeaderboard } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import { TbConfetti } from "react-icons/tb";
import { LuHistory } from "react-icons/lu";
import { IoIosInformationCircleOutline } from "react-icons/io";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../config/firebase";
import Title from "../components/Title";
import PasswordField from "../components/PasswordField";
import ConstraintBlock from "../components/ConstraintBlock";
import Leaderboard from "../components/Leaderboard";
import History from "../components/History";

function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [HighestLevel, setHighestLevel] = useState(1);

  const [notReadyPopup, setNotReadyPopup] = useState(false);
  const [winPopup, setWinPopup] = useState(false);
  const [losePopup, setLosePopup] = useState(false);
  const [leaderboardPopup, setLeaderboardPopup] = useState(false);
  const [HistoryPopup, setHistoryPopup] = useState(false);

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

  const resetNonGamePopup = () => {
    setHistoryPopup(false);
    setLeaderboardPopup(false);
    setNotReadyPopup(false);
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
                    onClick={() => {
                      resetNonGamePopup();
                      setNotReadyPopup(true);
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-red-600 hover:bg-red-700 focus:ring-red-900"
                    onClick={() => {
                      resetNonGamePopup();
                      setNotReadyPopup(true);
                    }}
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
              <li
                className="flex flex-row items-center cursor-pointer"
                onClick={() => {
                  resetNonGamePopup();
                  setLeaderboardPopup(true);
                }}
              >
                <MdOutlineLeaderboard className="m-2 size-6" /> Leaderboard
              </li>
              <li
                className="flex flex-row items-center cursor-pointer"
                onClick={() => {
                  resetNonGamePopup();
                  setHistoryPopup(true);
                }}
              >
                <LuHistory className="m-2 size-6" /> History
              </li>
              <li className="flex flex-row items-center cursor-pointer">
                <a
                  href="https://github.com/NoHaitch/Password-Game/blob/main/README.md"
                  target="_blank"
                  className="flex flex-row items-center "
                >
                  <IoIosInformationCircleOutline className="m-2 size-6" /> About
                </a>
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
            {1 <= HighestLevel && (
              <ConstraintBlock ruleNumber="1" state="false" />
            )}
            {2 <= HighestLevel && (
              <ConstraintBlock ruleNumber="2" state="false" />
            )}
            {3 <= HighestLevel && (
              <ConstraintBlock ruleNumber="3" state="false" />
            )}
            {4 <= HighestLevel && (
              <ConstraintBlock ruleNumber="4" state="false" />
            )}
            {5 <= HighestLevel && (
              <ConstraintBlock ruleNumber="5" state="false" />
            )}
            {6 <= HighestLevel && (
              <ConstraintBlock ruleNumber="6" state="false" />
            )}
            {7 <= HighestLevel && (
              <ConstraintBlock ruleNumber="7" state="false" />
            )}
            {8 <= HighestLevel && (
              <ConstraintBlock ruleNumber="8" state="false" />
            )}
            {9 <= HighestLevel && (
              <ConstraintBlock ruleNumber="9" state="false" />
            )}
            {10 <= HighestLevel && (
              <ConstraintBlock ruleNumber="10" state="false" />
            )}
            {11 <= HighestLevel && (
              <ConstraintBlock ruleNumber="11" state="false" />
            )}
            {12 <= HighestLevel && (
              <ConstraintBlock ruleNumber="12" state="false" />
            )}
            {13 <= HighestLevel && (
              <ConstraintBlock ruleNumber="13" state="false" />
            )}
            {14 <= HighestLevel && (
              <ConstraintBlock ruleNumber="14" state="false" />
            )}
            {15 <= HighestLevel && (
              <ConstraintBlock ruleNumber="15" state="false" />
            )}
            {16 <= HighestLevel && (
              <ConstraintBlock ruleNumber="16" state="false" />
            )}
            {17 <= HighestLevel && (
              <ConstraintBlock ruleNumber="17" state="false" />
            )}
            {18 <= HighestLevel && (
              <ConstraintBlock ruleNumber="18" state="false" />
            )}
            {19 <= HighestLevel && (
              <ConstraintBlock ruleNumber="19" state="false" />
            )}
            {20 <= HighestLevel && (
              <ConstraintBlock ruleNumber="20" state="false" />
            )}
          </>
        )}

        {losePopup && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setLosePopup(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <h1 className="m-2 text-xl">You Lose!</h1>
              <h1 className="m-2 text-gray-400 text-xs">
                Use the side menu to make a new game
              </h1>
            </div>
          </div>
        )}

        {winPopup && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setWinPopup(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <div className="flex flex-row justify-center items-center">
                <TbConfetti className="size-[24px] text-red-500" />
                <h1 className="m-2 text-xl">You Win!</h1>
              </div>
              <h1 className="m-2">Score: {score}</h1>
              <h1 className="m-2 text-gray-400 text-xs">
                Use the side menu to make a new game
              </h1>
            </div>
          </div>
        )}

        {notReadyPopup && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setNotReadyPopup(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <h1 className="m-2 text-xl">This Feature is not ready yet!</h1>
            </div>
          </div>
        )}

        {leaderboardPopup && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setLeaderboardPopup(false)}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <Leaderboard />
            </div>
          </div>
        )}

        {HistoryPopup && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[800px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => {
                  setHistoryPopup(false);
                }}
              >
                <svg
                  class="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <History />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
