import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Textarea from "react-expanding-textarea";
import { twMerge } from "tailwind-merge";

import { MdOutlineLeaderboard } from "react-icons/md";
import { TbConfetti } from "react-icons/tb";
import { LuHistory } from "react-icons/lu";
import { IoIosInformationCircleOutline } from "react-icons/io";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "../config/firebase";
import Title from "../components/Title";
import ConstraintBlock from "../components/ConstraintBlock";
import Leaderboard from "../components/Leaderboard";
import History from "../components/History";
import Timer from "../components/Timer";

function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(0);
  const [timerTimer, setTimerTime] = useState(0);
  const [highscore, setHighscore] = useState(null);
  const [timerToggle, setTimerToggle] = useState(false);
  const [password, setPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const [HighestLevel, setHighestLevel] = useState(1);
  const [constraints, setConstraints] = useState(Array(20).fill(false));
  const [currentGame, setCurrentGame] = useState({
    cheat: false,
    rule1Var: 0,
    rule5Var: 0,
    rule5Progres: 0,
    rule8Var: [],
    rule9Var: 0,
    rule9Progres: 0,
    rule10On: false,
    rule10VarA: 0,
    rule10VarB: 0,
    rule10VarC: 0,
    rule11Trigger: false,
    rule11On: false,
    captchaValue: "",
    captchaImg: "",
    rule13Var: 1000,
    rule14On: false,
    rule14FeedCount: 0,
    rule14Timeout: 0,
    rule15Var: 0,
    rule15Value: [],
    Rule17Var: 0,
  });

  const oneWordCountryCodes = [
    "JP", // Japan
    "FR", // France
    "BR", // Brazil
    "DE", // Germany
    "IN", // India
    "CN", // China
    "AU", // Australia
    "MX", // Mexico
    "EG", // Egypt
    "GR", // Greece
    "IT", // Italy
    "MA", // Morocco
    "PE", // Peru
    "ES", // Spain
    "TH", // Thailand
    "SE", // Sweden
    "TR", // Turkey
    "FI", // Finland
    "VN", // Vietnam
    "PT", // Portugal
    "NO", // Norway
    "CL", // Chile
    "HU", // Hungary
    "PL", // Poland
    "AR", // Argentina
    "DK", // Denmark
    "ID", // Indonesia
    "IR", // Iran
    "IQ", // Iraq
    "MY", // Malaysia
    "RU", // Russia
    "CH", // Switzerland
    "CO", // Colombia
    "KE", // Kenya
    "NL", // Netherlands
    "CU", // Cuba
  ];
  const [count, setCount] = useState(0);
  const [burningTimeout, setBurningTimeout] = useState(false);
  const burnIntervalRef = useRef(null);
  const FeedIntervalRef = useRef(null);
  const reappearTimeoutRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [popup, setPopup] = useState({
    notReady: false,
    win: false,
    lose: false,
    leaderboard: false,
    history: false,
  });

  const [resetConfirmation, setResetConfirmation] = useState(false);
  const [newGameDialog, setNewGameDialog] = useState(false);

  const [playing, setPlaying] = useState(false);
  const [passwordActive, setPasswordActive] = useState(false);
  const [difficultyStyle, setDifficultyStyle] = useState("");
  const [difficulty, setDifficulty] = useState("None");
  const [difficultyMessage, setDifficultyMessage] = useState("");
  const [newDifficulty, setNewDifficulty] = useState("");
  const [newDifficultyStyle, setNewDifficultyStyle] = useState("");
  const [loseMessage, setLoseMessage] = useState("");

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log(err);
    }
  };

  const resetNonGamePopup = () => {
    setPopup((popup) => ({
      ...popup,
      notReady: false,
      leaderboard: false,
      history: false,
    }));
  };

  const resetCurrentGame = () => {
    setPassword("");
    setScore(0);
    setHighestLevel(1);
    setCurrentGame({
      cheat: false,
      rule1Var: 0,
      rule5Var: 0,
      rule5Progres: 0,
      rule8Var: [],
      rule9Var: 0,
      rule9Progres: 0,
      rule10On: false,
      rule10VarA: 0,
      rule10VarB: 0,
      rule10VarC: 0,
      rule11Trigger: false,
      rule11On: false,
      captchaValue: "",
      captchaImg: "",
      rule13Var: 1000,
      rule14On: false,
      rule14FeedCount: 0,
      rule14Timeout: 0,
      rule15Var: 0,
      rule15Value: [],
      Rule17Var: 0,
    });
  };

  const handleTimeChange = (newTime) => {
    setTimerTime(newTime);
  };

  const handleGameStart = () => {
    setTimerTime(0);
    if (timerRef.current) {
      timerRef.current.setTimerTime(0);
    }
    resetCurrentGame();
    setTimerToggle(true);
    setPlaying(true);
    setPasswordActive(true);
    if (difficulty === "easy") {
      setCurrentGame((currentGame) => ({
        ...currentGame,
        rule1Var: 6,
        rule5Var: Math.floor(Math.random() * (50 - 30)) + 30,
        rule8Var: generateRandomCountryCodes(oneWordCountryCodes, 5),
        rule9Var: getValidMultiple(10, 100),
        rule10VarA: 6000,
        rule10VarB: 30000,
        rule10VarC: 40000,
        rule14FeedCount: 2,
        rule14Timeout: 30000,
        rule15Var: 2,
        rule17Var: Math.round(Math.random() * (0.5 - 0.1) + 0.1 * 100) / 100,
        captchaValue: generateCaptcha(),
      }));
    } else if (difficulty === "medium") {
      setCurrentGame((currentGame) => ({
        ...currentGame,
        rule1Var: 12,
        rule5Var: Math.floor(Math.random() * (100 - 50)) + 50,
        rule8Var: generateRandomCountryCodes(oneWordCountryCodes, 3),
        rule9Var: getValidMultiple(40, 200),
        rule10VarA: 4000,
        rule10VarB: 20000,
        rule10VarC: 30000,
        rule14FeedCount: 3,
        rule14Timeout: 25000,
        rule15Var: 4,
        rule17Var: Math.round(Math.random() * (0.1 - 0.2) + 0.2 * 100) / 100,
        captchaValue: generateCaptcha(),
      }));
    } else {
      setCurrentGame((currentGame) => ({
        ...currentGame,
        rule1Var: 18,
        rule5Var: Math.floor(Math.random() * (150 - 70)) + 70,
        rule8Var: generateRandomCountryCodes(oneWordCountryCodes, 1),
        rule9Var: getValidMultiple(80, 300),
        rule10VarA: 3000,
        rule10VarB: 10000,
        rule10VarC: 30000,
        rule14FeedCount: 2,
        rule14Timeout: 15000,
        rule15Var: 6,
        rule17Var: Math.round(Math.random() * (0.15 - 0.3) + 0.3 * 100) / 100,
        captchaValue: generateCaptcha(),
      }));
    }
  };

  const handleGameLose = async () => {
    if (!playing) return;
    setDifficultyMessage(difficulty);
    setPasswordActive(false);
    setPlaying(false);
    setTimerToggle(false);
    let resScore = calculateScore(false);
    setScore(resScore);
    setPopup((popup) => ({ ...popup, lose: true }));

    const historyData = {
      username: user?.email,
      difficulty: difficulty,
      score: resScore,
      password: password,
      won: false,
      captcha: currentGame.captchaImg,
      flags: currentGame.rule8Var,
      time: timerTimer,
      charBanned: currentGame.rule15Value,
      rule1: currentGame.rule1Var,
      rule5: currentGame.rule5Var,
      rule9: currentGame.rule9Var,
      rule17: currentGame.rule17Var,
    };

    try {
      const response = await fetch("http://localhost:8080/addGameHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(historyData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Game history added successfully:", data);
      } else {
        console.error("Failed to add game history:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding game history:", error);
    }
  };

  const handleGameWin = async () => {
    if (!playing) return;
    setDifficultyMessage(difficulty);
    setPasswordActive(false);
    setPlaying(false);
    setTimerToggle(false);
    let resScore = calculateScore(false);
    setScore(resScore);
    setPopup((popup) => ({ ...popup, win: true }));

    const historyData = {
      username: user?.email,
      difficulty: difficulty,
      score: resScore,
      password: password,
      won: true,
      captcha: currentGame.captchaImg,
      flags: currentGame.rule8Var,
      time: timerTimer,
      charBanned: currentGame.rule15Value,
      rule1: currentGame.rule1Var,
      rule5: currentGame.rule5Var,
      rule9: currentGame.rule9Var,
      rule17: currentGame.rule17Var,
    };

    try {
      const response = await fetch("http://localhost:8080/addGameHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(historyData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Game history added successfully:", data);
      } else {
        console.error("Failed to add game history:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding game history:", error);
    }
  };

  const generateRandomCountryCodes = (countryCodes, amount) => {
    const randomCodes = [];
    const usedIndices = new Set();
    const totalCountries = countryCodes.length;

    while (randomCodes.length < amount) {
      const randomIndex = Math.floor(Math.random() * totalCountries);

      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        randomCodes.push(countryCodes[randomIndex]);
      }
    }

    return randomCodes;
  };

  const getValidMultiple = (min, max) => {
    const validMultiples = [];
    for (let i = min; i <= max; i++) {
      if (i % 2 === 0 || i % 3 === 0 || i % 5 === 0) {
        validMultiples.push(i);
      }
    }
    const randomIndex = Math.floor(Math.random() * validMultiples.length);
    return validMultiples[randomIndex];
  };

  const handleCaptchaGenerate = (captchaText) => {
    setCurrentGame((currentGame) => ({
      ...currentGame,
      captchaValue: captchaText,
    }));
  };

  const handleCaptchaImgGenerate = (img) => {
    setCurrentGame((currentGame) => ({ ...currentGame, captchaImg: img }));
  };

  const handleCharPick = (chosenChars) => {
    setCurrentGame((currentGame) => ({
      ...currentGame,
      rule15Value: chosenChars,
    }));
  };

  const procFire = () => {
    if (inputRef.current) {
      inputRef.current.blur();
    }

    const lastNonFireIndex =
      password.lastIndexOf("🔥") === password.length - 1
        ? password.slice(0, -1).search(/[^🔥]$/)
        : password.search(/[^🔥]$/);

    if (lastNonFireIndex !== -1) {
      let newPassword = password.slice(0, lastNonFireIndex) + "🔥";
      setPassword(newPassword);
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const calculateScore = (isWin) => {
    if (isWin) {
      return HighestLevel * 1000 - timerTimer / 10 + 10000;
    } else {
      return Math.floor(HighestLevel * 500 - timerTimer / 50);
    }
  };

  const getHighlightedText = () => {
    const segments = password.split("");
    const romanNumeralsRegex = /^[IVXLCDM]$/;
    const numbersRegex = /^\d$/;

    return segments
      .map((char) => {
        const lowerChar = char.toLowerCase();
        const lowerHighlightArray = currentGame.rule15Value.map((c) =>
          c.toLowerCase()
        );

        if (
          HighestLevel >= 9 &&
          !constraints[8] &&
          romanNumeralsRegex.test(char)
        ) {
          return `<span style="background-color: red;">${char}</span>`;
        }
        if (
          ((HighestLevel >= 5 && !constraints[4]) ||
            (HighestLevel >= 17 && !constraints[16])) &&
          numbersRegex.test(char)
        ) {
          return `<span style="background-color: red;">${char}</span>`;
        }
        if (lowerHighlightArray.includes(lowerChar)) {
          return `<span style="background-color: red;">${char}</span>`;
        }
        return char;
      })
      .join("");
  };

  const generateCaptcha = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let captchaText = "";
    for (let i = 0; i < 6; i++) {
      captchaText += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return captchaText;
  };

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

    if (playing && passwordActive) {
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
              captcha: currentGame.captchaValue,
              rule13Var: currentGame.rule13Var,
              rule15Var: currentGame.rule15Var,
              rule15Value: currentGame.rule15Value,
              rule17Var: currentGame.rule17Var,
              rule18Var: password.length,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              for (let i = 0; i <= 20; i++) {
                if (!data.results[i]) {
                  if (i + 1 > HighestLevel) {
                    setHighestLevel(i + 1);
                  }
                  break;
                }
              }

              if (HighestLevel > 20) {
                handleGameWin();
              } else {
                setCurrentGame((currentGame) => ({
                  ...currentGame,
                  rule5Progres: data.rule5Progres,
                  rule9Progres: data.rule9Progres,
                  rule17Progres: data.rule17Progres,
                }));

                if (
                  currentGame.rule11On &&
                  !currentGame.rule14On &&
                  currentGame.rule11Trigger &&
                  !data.results[10]
                ) {
                  setLoseMessage("You lost the egg!");
                  handleGameLose();
                }

                if (currentGame.rule14On && !data.results[13]) {
                  setLoseMessage("You lost the chicken!");
                  handleGameLose();
                }

                if (
                  !currentGame.rule11Trigger &&
                  currentGame.rule11On &&
                  data.results[10]
                ) {
                  setCurrentGame((currentGame) => ({
                    ...currentGame,
                    rule11Trigger: true,
                  }));
                }

                if (!currentGame.rule10On && HighestLevel >= 10) {
                  setCurrentGame((currentGame) => ({
                    ...currentGame,
                    rule10On: true,
                  }));
                }

                if (
                  !currentGame.rule11On &&
                  HighestLevel >= 11 &&
                  !HighestLevel < 14
                ) {
                  setCurrentGame((currentGame) => ({
                    ...currentGame,
                    rule11On: true,
                  }));
                  procFire();
                }

                if (!currentGame.rule14On && HighestLevel >= 14) {
                  let newPassword = password;
                  newPassword = newPassword.replace(/🥚/, "🐔");
                  setPassword(newPassword);
                  setCurrentGame((currentGame) => ({
                    ...currentGame,
                    rule11On: false,
                    rule14On: true,
                  }));
                }
              }

              setConstraints(data.results || Array(20).fill(false));
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
  }, [playing, password, passwordActive, HighestLevel, currentGame]);

  useEffect(() => {
    if (difficulty !== "None") {
      handleGameStart();
    }
  }, [difficulty]);

  useEffect(() => {
    if (playing && passwordActive && !currentGame.cheat) {
      if (currentGame.rule10On && !currentGame.cheat) {
        burnIntervalRef.current = setInterval(() => {
          setPassword((prevPassword) => {
            const firstIndexFire = prevPassword.indexOf("🔥");
            if (firstIndexFire !== -1 && firstIndexFire !== 0) {
              return (
                prevPassword.slice(0, firstIndexFire - 1) +
                "🔥" +
                prevPassword.slice(firstIndexFire)
              );
            } else {
              clearInterval(burnIntervalRef.current);
              return prevPassword;
            }
          });
        }, currentGame.rule10VarA);
      } else {
        clearInterval(burnIntervalRef.current);
      }
    }

    return () => clearInterval(burnIntervalRef.current);
  }, [
    playing,
    passwordActive,
    currentGame.rule10On,
    currentGame.cheat,
    burningTimeout,
  ]);

  useEffect(() => {
    if (
      password.indexOf("🔥") === -1 &&
      currentGame.rule10On &&
      !burningTimeout &&
      !currentGame.cheat
    ) {
      setBurningTimeout(true);
      const reappearTime =
        Math.random() * (currentGame.rule10VarC - currentGame.rule10VarB) +
        currentGame.rule10VarB;

      reappearTimeoutRef.current = setTimeout(() => {
        procFire();
      }, reappearTime);
      setTimeout(() => {
        setBurningTimeout(false);
      }, reappearTime);
    } else {
      clearTimeout(reappearTimeoutRef.current);
    }

    return () => clearTimeout(reappearTimeoutRef.current);
  }, [
    password,
    currentGame.cheat,
    currentGame.rule10On,
    currentGame.rule10VarC,
    currentGame.rule10VarB,
  ]);

  useEffect(() => {
    if (
      playing &&
      password &&
      password.toLowerCase().includes("cheat") &&
      !currentGame.cheat
    ) {
      fetch("http://localhost:8080/cheat", {
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
          captcha: currentGame.captchaValue,
          rule13Var: currentGame.rule13Var,
          rule15Var: currentGame.rule15Var,
          rule15Value: currentGame.rule15Value,
          rule17Var: currentGame.rule17Var,
          length: password.length,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.solveable) {
            console.log("Cheat Successful:", data.cheatedPassword);

            setPassword(data.cheatedPassword);
            setCount(data.cheatedPassword.length);
            setCurrentGame((currentGame) => ({
              ...currentGame,
              rule15Value: data.rule15Value,
              cheat: true,
            }));
          } else {
            console.log("Cheat failed. Redoing Cheat.");
            console.log(data.cheatedPassword);
            setCurrentGame((currentGame) => ({
              ...currentGame,
              captchaValue: generateCaptcha(),
            }));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [playing, password, currentGame]);

  useEffect(() => {
    if (currentGame.rule14On && !currentGame.cheat) {
      FeedIntervalRef.current = setInterval(() => {
        setPassword((prevPassword) => {
          let wormCount = (prevPassword.match(/🐛/g) || []).length;

          if (wormCount >= currentGame.rule14FeedCount) {
            let newPassword = prevPassword;
            for (let i = 0; i < currentGame.rule14FeedCount; i++) {
              newPassword = newPassword.replace(/🐛/, "");
            }
            return newPassword;
          } else {
            if (playing) {
              setLoseMessage("You forgot to feed the chicken!");
              handleGameLose();
            }
            return prevPassword;
          }
        });
      }, currentGame.rule14Timeout);
    } else {
      clearInterval(FeedIntervalRef.current);
    }

    return () => clearInterval(FeedIntervalRef.current);
  }, [
    currentGame.rule14On,
    currentGame.rule14Timeout,
    currentGame.cheat,
    password,
  ]);

  useEffect(() => {
    if ((popup.lose || popup.win) && difficulty !== "None") {
      const fetchHighscore = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/highscore?username=${user?.email}&difficulty=${difficulty}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch highscore");
          }
          const data = await response.json();
          setHighscore(data.highscore);
        } catch (error) {
          console.error("Error fetching highscore:", error);
        }
      };

      fetchHighscore();
    }
  }, [popup.lose, popup.win, user?.email, difficulty]);

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
          className="fixed top-0 left-0 z-[100] w-64 h-screen transition-transform text-gray-400 "
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
                      setPopup((popup) => ({ ...popup, notReady: true }));
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="focus:outline-none text-white focus:ring-4 font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-red-600 hover:bg-red-700 focus:ring-red-900"
                    onClick={() => {
                      resetNonGamePopup();
                      setPopup((popup) => ({ ...popup, notReady: true }));
                    }}
                  >
                    Load
                  </button>
                </div>
                <button
                  type="button"
                  className="focus:outline-none text-white focus:ring-4  font-medium rounded-lg text-sm px-4 py-2 me-2 mb-2 bg-green-600 hover:bg-green-700 focus:ring-green-800"
                  onClick={() => {
                    setPopup((popup) => ({
                      ...popup,
                      win: false,
                      lose: false,
                    }));
                    resetNonGamePopup();
                    setNewGameDialog(true);
                  }}
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
                  setPopup((popup) => ({ ...popup, leaderboard: true }));
                }}
              >
                <MdOutlineLeaderboard className="m-2 size-6" /> Leaderboard
              </li>
              <li
                className="flex flex-row items-center cursor-pointer"
                onClick={() => {
                  resetNonGamePopup();
                  setPopup((popup) => ({ ...popup, history: true }));
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
                      setNewDifficulty("easy");
                      setNewDifficultyStyle("text-green-400");
                    } else {
                      if (difficulty === "easy") {
                        setDifficulty("None");
                      }
                      setDifficulty("easy");
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
                      setNewDifficulty("medium");
                      setNewDifficultyStyle("text-blue-400");
                    } else {
                      if (difficulty === "medium") {
                        setDifficulty("None");
                      }
                      setDifficulty("medium");
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
                      setNewDifficulty("hard");
                      setNewDifficultyStyle("text-red-400");
                    } else {
                      if (difficulty === "hard") {
                        setDifficulty("None");
                      }
                      setDifficulty("hard");
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
                    setResetConfirmation(false);
                    handleGameStart();
                    if (difficulty === newDifficulty) {
                      setDifficulty("None");
                    }
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
        {difficulty === "None" ? (
          <div className="text-gray-400 text-center m-4">
            <h1>No Game started.</h1>
            <h1>Use the button on the sidebar to load or start a new game.</h1>
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center justify-center">
              <div>
                <label
                  htmlFor="textarea"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Choose a password!
                </label>
                <div className="relative w-[500px]">
                  <div
                    className="absolute inset-0 p-2.5 text-lg bg-transparent pointer-events-none whitespace-pre-wrap break-words text-white"
                    style={{ zIndex: 1 }}
                    dangerouslySetInnerHTML={{ __html: getHighlightedText() }}
                  ></div>

                  <Textarea
                    className="w-full resize-none block p-2.5 text-lg rounded-lg border-2 bg-[#1E1F20] border-[#7188D9] placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    id="textarea"
                    placeholder="Password..."
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setCount(e.target.value.length);
                    }}
                    value={password}
                    ref={inputRef}
                    style={{
                      backgroundColor: "transparent",
                      color: "transparent",
                      caretColor: "white",
                      zIndex: 2,
                      position: "relative",
                    }}
                  />
                  {!passwordActive && (
                    <div className="absolute z-[20] top-0 w-full h-[300px]"></div>
                  )}
                </div>
              </div>
              <p
                className={twMerge(
                  "text-white absolute mr-[-550px] mb-[-20px] text-left",
                  HighestLevel >= 19 && !constraints[18] ? "bg-red-400" : ""
                )}
              >
                {count}
              </p>
            </div>
            <>
              {1 <= HighestLevel && !constraints[0] && (
                <ConstraintBlock
                  ruleNumber="1"
                  state={constraints[0]}
                  data={currentGame}
                />
              )}
              {2 <= HighestLevel && !constraints[1] && (
                <ConstraintBlock
                  ruleNumber="2"
                  state={constraints[1]}
                  data={currentGame}
                />
              )}
              {3 <= HighestLevel && !constraints[2] && (
                <ConstraintBlock
                  ruleNumber="3"
                  state={constraints[2]}
                  data={currentGame}
                />
              )}
              {4 <= HighestLevel && !constraints[3] && (
                <ConstraintBlock
                  ruleNumber="4"
                  state={constraints[3]}
                  data={currentGame}
                />
              )}
              {5 <= HighestLevel && !constraints[4] && (
                <ConstraintBlock
                  ruleNumber="5"
                  state={constraints[4]}
                  data={currentGame}
                />
              )}
              {6 <= HighestLevel && !constraints[5] && (
                <ConstraintBlock
                  ruleNumber="6"
                  state={constraints[5]}
                  data={currentGame}
                />
              )}
              {7 <= HighestLevel && !constraints[6] && (
                <ConstraintBlock
                  ruleNumber="7"
                  state={constraints[6]}
                  data={currentGame}
                />
              )}
              {8 <= HighestLevel && !constraints[7] && (
                <ConstraintBlock
                  ruleNumber="8"
                  state={constraints[7]}
                  data={currentGame}
                />
              )}
              {9 <= HighestLevel && !constraints[8] && (
                <ConstraintBlock
                  ruleNumber="9"
                  state={constraints[8]}
                  data={currentGame}
                />
              )}
              {10 <= HighestLevel && !constraints[9] && (
                <ConstraintBlock
                  ruleNumber="10"
                  state={constraints[9]}
                  data={currentGame}
                />
              )}
              {11 <= HighestLevel && !constraints[10] && (
                <ConstraintBlock
                  ruleNumber="11"
                  state={constraints[10]}
                  data={currentGame}
                />
              )}
              {12 <= HighestLevel && !constraints[11] && (
                <ConstraintBlock
                  ruleNumber="12"
                  state={constraints[11]}
                  data={currentGame}
                  onCaptchaGenerate={handleCaptchaGenerate}
                  onCaptchaImageGenerate={handleCaptchaImgGenerate}
                  initialCaptchaText={currentGame.captchaValue}
                  initialCaptchaImage={currentGame.captchaImg}
                />
              )}
              {13 <= HighestLevel && !constraints[12] && (
                <ConstraintBlock
                  ruleNumber="13"
                  state={constraints[12]}
                  data={currentGame}
                />
              )}
              {14 <= HighestLevel && !constraints[13] && (
                <ConstraintBlock
                  ruleNumber="14"
                  state={constraints[13]}
                  data={currentGame}
                />
              )}
              {15 <= HighestLevel && !constraints[14] && (
                <ConstraintBlock
                  ruleNumber="15"
                  state={constraints[14]}
                  data={currentGame}
                  onLetterPick={handleCharPick}
                  initialSelection={currentGame.rule15Value}
                />
              )}
              {16 <= HighestLevel && !constraints[15] && (
                <ConstraintBlock
                  ruleNumber="16"
                  state={constraints[15]}
                  data={currentGame}
                />
              )}
              {17 <= HighestLevel && !constraints[16] && (
                <ConstraintBlock
                  ruleNumber="17"
                  state={constraints[16]}
                  data={currentGame}
                />
              )}
              {18 <= HighestLevel && !constraints[17] && (
                <ConstraintBlock
                  ruleNumber="18"
                  state={constraints[17]}
                  data={currentGame}
                />
              )}
              {19 <= HighestLevel && !constraints[18] && (
                <ConstraintBlock
                  ruleNumber="19"
                  state={constraints[18]}
                  data={currentGame}
                />
              )}
              {20 <= HighestLevel && !constraints[19] && (
                <ConstraintBlock
                  ruleNumber="20"
                  state={constraints[19]}
                  data={currentGame}
                />
              )}
            </>
            <div className="flex flex-col-reverse">
              {1 <= HighestLevel && constraints[0] && (
                <ConstraintBlock
                  ruleNumber="1"
                  state={constraints[0]}
                  data={currentGame}
                />
              )}
              {2 <= HighestLevel && constraints[1] && (
                <ConstraintBlock
                  ruleNumber="2"
                  state={constraints[1]}
                  data={currentGame}
                />
              )}
              {3 <= HighestLevel && constraints[2] && (
                <ConstraintBlock
                  ruleNumber="3"
                  state={constraints[2]}
                  data={currentGame}
                />
              )}
              {4 <= HighestLevel && constraints[3] && (
                <ConstraintBlock
                  ruleNumber="4"
                  state={constraints[3]}
                  data={currentGame}
                />
              )}
              {5 <= HighestLevel && constraints[4] && (
                <ConstraintBlock
                  ruleNumber="5"
                  state={constraints[4]}
                  data={currentGame}
                />
              )}
              {6 <= HighestLevel && constraints[5] && (
                <ConstraintBlock
                  ruleNumber="6"
                  state={constraints[5]}
                  data={currentGame}
                />
              )}
              {7 <= HighestLevel && constraints[6] && (
                <ConstraintBlock
                  ruleNumber="7"
                  state={constraints[6]}
                  data={currentGame}
                />
              )}
              {8 <= HighestLevel && constraints[7] && (
                <ConstraintBlock
                  ruleNumber="8"
                  state={constraints[7]}
                  data={currentGame}
                />
              )}
              {9 <= HighestLevel && constraints[8] && (
                <ConstraintBlock
                  ruleNumber="9"
                  state={constraints[8]}
                  data={currentGame}
                />
              )}
              {10 <= HighestLevel && constraints[9] && (
                <ConstraintBlock
                  ruleNumber="10"
                  state={constraints[9]}
                  data={currentGame}
                />
              )}
              {11 <= HighestLevel && constraints[10] && (
                <ConstraintBlock
                  ruleNumber="11"
                  state={constraints[10]}
                  data={currentGame}
                />
              )}
              {12 <= HighestLevel && constraints[11] && (
                <ConstraintBlock
                  ruleNumber="12"
                  state={constraints[11]}
                  data={currentGame}
                  onCaptchaGenerate={handleCaptchaGenerate}
                  onCaptchaImageGenerate={handleCaptchaImgGenerate}
                  initialCaptchaText={currentGame.captchaValue}
                  initialCaptchaImage={currentGame.captchaImg}
                />
              )}
              {13 <= HighestLevel && constraints[12] && (
                <ConstraintBlock
                  ruleNumber="13"
                  state={constraints[12]}
                  data={currentGame}
                />
              )}
              {14 <= HighestLevel && constraints[13] && (
                <ConstraintBlock
                  ruleNumber="14"
                  state={constraints[13]}
                  data={currentGame}
                />
              )}
              {15 <= HighestLevel && constraints[14] && (
                <ConstraintBlock
                  ruleNumber="15"
                  state={constraints[14]}
                  data={currentGame}
                  onLetterPick={handleCharPick}
                  initialSelection={currentGame.rule15Value}
                />
              )}
              {16 <= HighestLevel && constraints[15] && (
                <ConstraintBlock
                  ruleNumber="16"
                  state={constraints[15]}
                  data={currentGame}
                />
              )}
              {17 <= HighestLevel && constraints[16] && (
                <ConstraintBlock
                  ruleNumber="17"
                  state={constraints[16]}
                  data={currentGame}
                />
              )}
              {18 <= HighestLevel && constraints[17] && (
                <ConstraintBlock
                  ruleNumber="18"
                  state={constraints[17]}
                  data={currentGame}
                />
              )}
              {19 <= HighestLevel && constraints[18] && (
                <ConstraintBlock
                  ruleNumber="19"
                  state={constraints[18]}
                  data={currentGame}
                />
              )}
              {20 <= HighestLevel && constraints[19] && (
                <ConstraintBlock
                  ruleNumber="20"
                  state={constraints[19]}
                  data={currentGame}
                />
              )}
            </div>
          </>
        )}

        <div className="absolute right-5 top-5 scale-[0.85]">
          <Timer
            isActive={timerToggle}
            ref={timerRef}
            onTimeUpdate={(time) => setTimerTime(time)}
            onTimeChange={handleTimeChange}
          />
        </div>

        {popup.lose && (
          <div className="fixed top-0 left-0 bg-black bg-opacity-70 z-50 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setPopup((popup) => ({ ...popup, lose: false }))}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <h1 className="m-2 text-xl">You Lose!</h1>
              <h1 className="m-2 text-gray-400">
                Difficulty: {difficultyMessage}
              </h1>
              <h1 className="m-2 text-xl text-red-500">{loseMessage}</h1>
              <h1 className="my-4 font-bold text-xl">Score: {score}</h1>
              {highscore !== null && (
                <h1 className="mt-2 text-gray-200">
                  {score > highscore
                    ? "New Highscore!"
                    : score === highscore
                    ? `You've reached your highscore of ${highscore}`
                    : `Highscore: ${highscore}`}
                </h1>
              )}
              <h1 className="m-2 text-gray-400 text-xs">
                Use the side menu to make a new game
              </h1>
            </div>
          </div>
        )}

        {popup.win && (
          <div className="fixed top-0 left-0 bg-black bg-opacity-70 z-50 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => setPopup((popup) => ({ ...popup, win: false }))}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <div className="flex flex-row justify-center items-center text-center ">
                <TbConfetti className="size-[24px] text-red-500" />
                <h1 className="m-2 text-xl text-green-500">
                  Congrats You Win!
                </h1>
              </div>
              <h1 className="m-2 text-gray-400">
                Difficulty: {difficultyMessage}
              </h1>
              <h1 className="my-4 font-bold text-xl">Score: {score}</h1>
              {highscore !== null && (
                <h1 className="mt-2 text-gray-200">
                  {score > highscore
                    ? "New Highscore!"
                    : score === highscore
                    ? `You've reached your highscore of ${highscore}`
                    : `Highscore: ${highscore}`}
                </h1>
              )}
              <h1 className="m-2 text-gray-400 text-xs">
                Use the side menu to make a new game
              </h1>
            </div>
          </div>
        )}

        {popup.notReady && (
          <div className="fixed top-0 left-0 bg-black bg-opacity-70 z-50 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[400px]">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() =>
                  setPopup((popup) => ({ ...popup, notReady: false }))
                }
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <h1 className="m-2 text-xl">This Feature is not ready yet!</h1>
            </div>
          </div>
        )}

        {popup.leaderboard && (
          <div className="fixed top-0 left-0 bg-black bg-opacity-70 z-50 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[700px]">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() =>
                  setPopup((popup) => ({ ...popup, leaderboard: false }))
                }
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
              <Leaderboard />
            </div>
          </div>
        )}

        {popup.history && (
          <div className="fixed top-0 left-0 bg-black bg-opacity-70 z-50 pl-64 w-full h-screen flex justify-center items-center">
            <div className="bg-[#2e0d3f] rounded-lg p-4 text-white flex flex-col text-center w-[80%]">
              <button
                type="button"
                className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white absolute"
                onClick={() => {
                  setPopup((popup) => ({ ...popup, history: false }));
                }}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
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
