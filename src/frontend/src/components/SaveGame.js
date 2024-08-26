import React, { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

const SaveGame = ({ username, difficulty, currentGame, timerTimer, password, playing, generateCaptcha, generateCaptchaImage }) => {
  const [saves, setSaves] = useState([]);

  useEffect(() => {
    if (username) {
      fetchSaves(username);
    }
  }, [username]);

  const fetchSaves = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/getSaves?username=${encodeURIComponent(username)}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSaves(data.saves || []);
    } catch (error) {
      console.error("Error fetching saves:", error);
    }
  };

  const deleteSave = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/deleteSave?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setSaves(saves.filter((save) => save.id !== id));
    } catch (error) {
      console.error("Error deleting save:", error);
    }
  };

  const handleSaveGame = async () => {
    if (!playing) return;

    if (currentGame.captchaValue === "") {
      currentGame.captchaValue = generateCaptcha()
    }
    
    try {
      const response = await fetch("http://localhost:8080/saveGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          difficulty: difficulty,
          password: password,
          captcha: currentGame.captchaValue,
          captchaImg: generateCaptchaImage(currentGame.captchaValue),
          flags: currentGame.rule8Var,
          time: timerTimer,
          charBanned: currentGame.rule15Value,
          rule1: currentGame.rule1Var,
          rule5: currentGame.rule5Var,
          rule9: currentGame.rule9Var,
          rule17: currentGame.rule17Var,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      fetchSaves(username);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Save Slots</h1>
      <button
        onClick={handleSaveGame}
        disabled={!playing}
        className={`mb-4 p-2 rounded ${!playing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white  hover:bg-blue-600"}`}
      >
        Save Current Game
      </button>
      <div className="space-y-4">
        {saves.length > 0 ? (
          saves.map((save) => (
            <div
              key={save.id}
              className="flex flex-row items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              <div className="flex flex-row justify-center items-center gap-2 flex-wrap">
                <p className="text-lg font-medium">Save ID: {save.id}</p>
                <p className="text-sm">
                  Date: {new Date(save.date).toLocaleDateString()}
                </p>
                <p className="text-sm">Difficulty: {save.difficulty}</p>
                <p className="text-sm">Time: {save.time/1000} seconds</p>
                <p className="text-sm">Password: {save.password}</p>
              </div>
              <button
                onClick={() => deleteSave(save.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrashAlt className="text-xl" />
              </button>
            </div>
          ))
        ) : (
          <p>No saves found</p>
        )}
      </div>
    </div>
  );
};

export default SaveGame;
