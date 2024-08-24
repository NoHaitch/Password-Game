import React, { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/leaderboard?difficulty=${difficulty}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
          const processedLeaderboard = data.leaderboard.map((entry) => {
            const [username, highscore] = entry.split(": ");
            return { username, highscore: parseInt(highscore, 10) };
          });
          setLeaderboard(processedLeaderboard);
        } else {
          setLeaderboard(null);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError("Server Error: Failed to fetch data");
        setLoading(false);
      });
  }, [difficulty]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="m-2">
      <h1 className="text-white text-2xl font-bold mb-4 text-center">
        Leaderboard
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
      ) : leaderboard === null ? (
        <div className="text-center p-4">
          No scores available for this selection.
        </div>
      ) : (
        <div className="flex justify-center overflow-x-auto">
          <table className="min-w-full shadow-md rounded-lg bg-black bg-opacity-5 m-2">
            <thead>
              <tr className="uppercase text-sm leading-normal border-b text-white">
                <th className="py-3 px-6 text-center">Rank</th>
                <th className="py-3 px-6 text-center">Username</th>
                <th className="py-3 px-6 text-center">Highscore</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user.username} className="border-b text-slate-300">
                  <td className="py-3 px-6 text-center">{index + 1}</td>
                  <td className="py-3 px-6">{user.username}</td>
                  <td className="py-3 px-6 text-center">{user.highscore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
