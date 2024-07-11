import React from "react";

const Title = () => {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-title m-4 text-[#7188D9]">
        The Password Game
      </h1>
      <h2 className="text-xl text-white font-mono">
        inspired by the{"  "}
        <a href="https://neal.fun/password-game/" className="underline">
          original
        </a>
      </h2>
    </div>
  );
};

export default Title;
