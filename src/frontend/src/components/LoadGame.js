import React, { useState, useEffect } from "react";
import { FaTrashAlt, FaPlay } from "react-icons/fa";

const LoadGame = ({
  username,
  setDifficulty,
  setPlaying,
  setPassword,
  setCurrentGame,
  currentGame,
}) => {
  const [saves, setSaves] = useState([]);
  const [doubleClick, setDoubleClick] = useState(false);

  useEffect(() => {
    if (username) {
      fetchSaves(username);
    }
  }, [username]);

  const fetchSaves = async (username) => {
    try {
      const response = await fetch(
        `http://localhost:8080/getSaves?username=${encodeURIComponent(
          username
        )}`
      );
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
      const response = await fetch(
        `http://localhost:8080/deleteSave?id=${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setSaves(saves.filter((save) => save.id !== id));
    } catch (error) {
      console.error("Error deleting save:", error);
    }
  };

  const loadGame = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/loadGame?id=${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setDifficulty(data.gameSave.difficulty);
      setTimeout(() => {
        setPlaying(true);
        setPassword(data.gameSave.password);
        setCurrentGame((currentGame) => ({
          ...currentGame,
          cheat: false,
          captchaImg: data.gameSave.captchaImage,
          captchaValue: data.gameSave.captcha,
          rule5Var: data.gameSave.rule5,
          rule8Var: data.gameSave.flags,
          rule9Var: data.gameSave.rule9,
          rule15Value: data.gameSave.charBanned,
          rule17Var: data.gameSave.rule17,
        }));
        if (doubleClick) {
          setDoubleClick(false);
        } else {
          setDoubleClick(true);
          document.getElementById(`save-${id}`).click();
        }

      }, 100);
    } catch (error) {
      console.error("Error loading save:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Load Slots</h1>
      <div className="space-y-4">
        {saves.length > 0 ? (
          saves.map((save) => (
            <div
              key={save.id}
              className="flex flex-row items-center justify-between p-4 border rounded-lg shadow-sm"
            >
              <div className="flex flex-row items-center gap-2 flex-wrap">
                <p className="text-lg font-medium">Save ID: {save.id}</p>
                <p className="text-sm">
                  Date: {new Date(save.date).toLocaleDateString()}
                </p>
                <p className="text-sm">Difficulty: {save.difficulty}</p>
                <p className="text-sm">Time: {save.time / 1000} seconds</p>
                <p className="text-sm">Password: {save.password}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadGame(save.id)}
                  id={`save-${save.id}`}
                  className="text-green-500 hover:text-green-700 flex items-center gap-1 m-2"
                >
                  <FaPlay className="text-xl" />
                  <span>Load</span>
                </button>
                <button
                  onClick={() => deleteSave(save.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrashAlt className="text-xl" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No saves found</p>
        )}
      </div>
    </div>
  );
};

export default LoadGame;
