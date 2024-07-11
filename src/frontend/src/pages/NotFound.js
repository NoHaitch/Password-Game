import React from "react";
import { Link } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";

function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center space-y-6">
      <h1 className="text-white text-8xl">404</h1>
      <h2 className="text-white text-5xl">Page Not Found</h2>
      <Link
        to="/"
        className="text-gray-500 flex flex-row justify-center items-center w-[250px]"
      >
        <RiArrowGoBackFill className="m-2" /> Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
