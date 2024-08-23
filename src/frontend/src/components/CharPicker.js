import React, { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

const CharPicker = ({ charLimit, onPick, initialSelection = [] }) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const [selectedChars, setSelectedChars] = useState([]);

  useEffect(() => {
    setSelectedChars(initialSelection);
  }, [initialSelection]);

  const toggleChar = (char) => {
    if (selectedChars.includes(char)) {
      const updatedSelection = selectedChars.filter((c) => c !== char);
      setSelectedChars(updatedSelection);
      onPick(updatedSelection);
    } else if (selectedChars.length < charLimit) {
      const updatedSelection = [...selectedChars, char];
      setSelectedChars(updatedSelection);
      onPick(updatedSelection);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center my-3 mx-2">
      {alphabet.map((char) => (
        <button
          key={char}
          onClick={() => toggleChar(char)}
          className={twMerge(
            "p-2 bg-slate-700 border-2 rounded-lg border-solid border-[#000]",
            selectedChars.includes(char)
              ? "bg-[#ff4d4d] text-[#fff]"
              : " text-[#000]",
            selectedChars.length < charLimit || selectedChars.includes(char)
              ? "cursor-pointer"
              : "cursor-not-allowed"
          )}
          disabled={
            !selectedChars.includes(char) && selectedChars.length >= charLimit
          }
        >
          {char}
        </button>
      ))}
    </div>
  );
};

export default CharPicker;
