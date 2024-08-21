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
  const [score, setScore] = useState(0);
  const [password, setPassword] = useState("");
  const [HighestLevel, setHighestLevel] = useState(1);
  const [constraints, setConstraints] = useState(Array(20).fill(false));
  const [currentGame, setCurrentGame] = useState({
    rule1Var: 0,
    rule5Var: 0,
    rule5Progres: 0,
    rule8Var: [],
    rule9Var: 0,
    rule9Progres: 0,
  });

  const oneWordCountryCodes = [
    'JP', // Japan
    'FR', // France
    'BR', // Brazil
    'DE', // Germany
    'IN', // India
    'CN', // China
    'AU', // Australia
    'MX', // Mexico
    'EG', // Egypt
    'GR', // Greece
    'IT', // Italy
    'MA', // Morocco
    'PE', // Peru
    'ES', // Spain
    'TH', // Thailand
    'SE', // Sweden
    'TR', // Turkey
    'FI', // Finland
    'VN', // Vietnam
    'PT', // Portugal
    'NO', // Norway
    'CL', // Chile
    'HU', // Hungary
    'PL', // Poland
    'AR', // Argentina
    'DK', // Denmark
    'IR', // Iran
    'IQ', // Iraq
    'MY', // Malaysia
    'RU', // Russia
    'CH', // Switzerland
    'CO', // Colombia
    'KE', // Kenya
    'NL', // Netherlands
    'CU', // Cuba
  ];
  
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  const [popup, setPopup] = useState({
    notReady: false,
    win: false,
    lose: false,
    leaderboard: false,
    history: false,
  });

  const [resetConfirmation, setResetConfirmation] = useState(false);
  const [newGameDialog, setNewGameDialog] = useState(false);
  const [saveGameDialog, setSaveGameDialog] = useState(false);
  const [loadGameDialog, setLoadGameDialog] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [difficultyStyle, setDifficultyStyle] = useState("");
  const [difficulty, setDifficulty] = useState("");
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

  useEffect(() => {
    let interval;

    if (playing) {
      if (!password) {
        setConstraints(Array(20).fill(false));
      } else {
        interval = setInterval(() => {
          fetch("http://localhost:8080/main", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password,
              rule1Var: currentGame.rule1Var,
              rule5Var: currentGame.rule5Var,
              rule8Var: currentGame.rule8Var,
              rule9Var: currentGame.rule9Var,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data.results);

              setConstraints(data.results || Array(20).fill(false));

              for (let i = 0; i <= 20; i++) {
                if (!data.results[i]) {
                  if (i + 1 > HighestLevel) {
                    setHighestLevel(i + 1);
                  }
                  break;
                }
              }

              setCurrentGame({
                ...currentGame,
                rule5Progres: data.rule5Progres,
                rule9Progres: data.rule9Progres,
              });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }, 1000);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playing, password]);

  useEffect(() => {
    if (difficulty !== "") {
      handleGameStart();
    }
  }, [difficulty]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  const resetNonGamePopup = () => {
    setPopup({
      ...popup,
      notReady: false,
      leaderboard: false,
      history: false,
    });
  };

  const handleGameStart = () => {
    if (difficulty === "Easy") {
      setCurrentGame({
        ...currentGame,
        rule1Var: 6,
        rule5Var: Math.floor(Math.random() * (30 - 20 + 1)) + 20,
        rule8Var: generateRandomCountryCodes(oneWordCountryCodes, 5),
        rule9Var:
          (Math.floor(Math.random() * (30 - 10 + 1)) + 10) *
          (Math.floor(Math.random() * (5 - 1 + 1)) + 1),
      });
    } else if (difficulty === "Medium") {
      setCurrentGame({
        ...currentGame,
        rule1Var: 12,
        rule5Var: Math.floor(Math.random() * (70 - 40 + 1)) + 40,
        rule8Var: generateRandomCountryCodes(oneWordCountryCodes, 3),
        rule9Var:
          (Math.floor(Math.random() * (60 - 15 + 1)) + 15) *
          (Math.floor(Math.random() * (10 - 1 + 1)) + 1),
      });
    } else {
      setCurrentGame({
        ...currentGame,
        rule1Var: 18,
        rule5Var: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
        rule8Var: generateRandomCountryCodes(oneWordCountryCodes, 1),
        rule9Var:
          (Math.floor(Math.random() * (90 - 20 + 1)) + 20) *
          (Math.floor(Math.random() * (15 - 1 + 1)) + 1),
      });
    }
    setLoadingData(false);
  };

  const generateRandomCountryCodes = (countryCodes, amount) => {
    const randomCodes = [];
    const totalCountries = countryCodes.length;

    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * totalCountries);
      randomCodes.push(countryCodes[randomIndex]);
    }

    return randomCodes;
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
                      setPopup({ ...popup, notReady: true });
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-red-600 hover:bg-red-700 focus:ring-red-900"
                    onClick={() => {
                      resetNonGamePopup();
                      setPopup({ ...popup, notReady: true });
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
                  setPopup({ ...popup, leaderboard: true });
                }}
              >
                <MdOutlineLeaderboard className="m-2 size-6" /> Leaderboard
              </li>
              <li
                className="flex flex-row items-center cursor-pointer"
                onClick={() => {
                  resetNonGamePopup();
                  setPopup({ ...popup, history: true });
                }}
              >
                <LuHistory className="m-2 size-6" /> History
              </li>
              <li className="flex flex-row items-center cursor-pointer">
                <a
                  href="https://github.com/NoHaitch/Password-Game/blob/main/README.md"
                  target="_blank"
                  rel="noreferrer"
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
            <PasswordField
              onPasswordChange={(newPassword) => setPassword(newPassword)}
            />
            {1 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="1"
                state={constraints[0]}
                data={currentGame}
              />
            )}
            {2 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="2"
                state={constraints[1]}
                data={currentGame}
              />
            )}
            {3 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="3"
                state={constraints[2]}
                data={currentGame}
              />
            )}
            {4 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="4"
                state={constraints[3]}
                data={currentGame}
              />
            )}
            {5 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="5"
                state={constraints[4]}
                data={currentGame}
              />
            )}
            {6 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="6"
                state={constraints[5]}
                data={currentGame}
              />
            )}
            {7 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="7"
                state={constraints[6]}
                data={currentGame}
              />
            )}
            {8 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="8"
                state={constraints[7]}
                data={currentGame}
              />
            )}
            {9 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="9"
                state={constraints[8]}
                data={currentGame}
              />
            )}
            {10 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="10"
                state={constraints[9]}
                data={currentGame}
              />
            )}
            {11 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="11"
                state={constraints[10]}
                data={currentGame}
              />
            )}
            {12 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="12"
                state={constraints[11]}
                data={currentGame}
              />
            )}
            {13 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="13"
                state={constraints[12]}
                data={currentGame}
              />
            )}
            {14 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="14"
                state={constraints[13]}
                data={currentGame}
              />
            )}
            {15 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="15"
                state={constraints[14]}
                data={currentGame}
              />
            )}
            {16 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="16"
                state={constraints[15]}
                data={currentGame}
              />
            )}
            {17 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="17"
                state={constraints[16]}
                data={currentGame}
              />
            )}
            {18 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="18"
                state={constraints[17]}
                data={currentGame}
              />
            )}
            {19 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="19"
                state={constraints[18]}
                data={currentGame}
              />
            )}
            {20 <= HighestLevel && (
              <ConstraintBlock
                ruleNumber="20"
                state={constraints[19]}
                data={currentGame}
              />
            )}
          </>
        )}

        {popup.lose && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setPopup({ ...popup, lose: false })}
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

        {popup.win && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setPopup({ ...popup, win: false })}
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

        {popup.notReady && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setPopup({ ...popup, notReady: false })}
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

        {popup.leaderboard && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setPopup({ ...popup, leaderboard: false })}
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

        {popup.history && (
          <div className="absolute top-0 left-0 bg-black bg-opacity-70 z-10 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[800px]">
              <button
                type="button"
                class="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => {
                  setPopup({ ...popup, history: false });
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
