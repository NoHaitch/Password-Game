import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8080/history?username=${user.email}&difficulty=${difficulty}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (!data.history || !Array.isArray(data.history)) {
            setError("Unexpected data format");
          } else {
            setHistory(data.history);
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Server Error: Failed to fetch data");
          setLoading(false);
        });
    }
  }, [user, difficulty]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="m-2">
      <h1 className="text-white text-2xl font-bold mb-4 text-center">
        Game History
      </h1>

      <div className="mb-4">
        <div className="flex flex-col items-center space-y-4 mb-4">
          <div className="flex space-x-3">
            <button
              className={`py-2 px-4 rounded w-[96px] transition-transform duration-300 ease-in-out bg-lime-400 ${
                difficulty === "easy"
                  ? "text-gray-900 scale-110"
                  : "text-gray-800 opacity-50"
              }`}
              onClick={() => setDifficulty("easy")}
            >
              Easy
            </button>
            <button
              className={`py-2 px-4 rounded w-[96px] transition-transform duration-300 ease-in-out bg-orange-400 ${
                difficulty === "medium"
                  ? "text-gray-900 scale-110"
                  : "text-gray-800 opacity-50"
              }`}
              onClick={() => setDifficulty("medium")}
            >
              Medium
            </button>
            <button
              className={`py-2 px-4 rounded w-[96px] transition-transform duration-300 ease-in-out bg-red-400 ${
                difficulty === "hard"
                  ? "text-gray-900 scale-110"
                  : "text-gray-800 opacity-50"
              }`}
              onClick={() => setDifficulty("hard")}
            >
              Hard
            </button>
          </div>
        </div>
      </div>

      {error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-center p-4">
          No history available for this selection.
        </div>
      ) : (
        <div className="flex justify-center overflow-x-auto">
          <div className="w-full h-80 overflow-y-auto">
            <table className="min-w-full shadow-md rounded-lg bg-black bg-opacity-5">
              <thead>
                <tr className="uppercase text-sm leading-normal border-b text-white">
                  <th className="py-3 px-6 text-center">Date</th>
                  <th className="py-3 px-6 text-center">Score</th>
                  <th className="py-3 px-6 text-center">Time</th>
                  <th className="py-3 px-6 text-center">Won</th>
                  <th className="py-3 px-6 text-center">Password</th>
                </tr>
              </thead>
              <tbody>
                {history.map((game, index) => (
                  <tr key={index} className="border-b text-slate-300">
                    <td className="py-3 px-6 text-center">{game.date.split('T')[0]}</td>
                    <td className="py-3 px-6 text-center">{game.score}</td>
                    <td className="py-3 px-6 text-center">{game.time}</td>
                    <td className="py-3 px-6 text-center">
                      {game.isWon ? "Win" : "Lose"}
                    </td>
                    <td className="py-3 px-6 text-center">
                      {game.password}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
