import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { AiOutlineRedo } from "react-icons/ai";

import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { twMerge } from "tailwind-merge";

const Auth = () => {
  const [toggleLogin, setToggleLogin] = useState("flex");
  const [toggleRegister, setToggleRegister] = useState("hidden");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState("");

  const Register = async () => {
    try {
      if (registerPassword.length > 6) {
        if (registerPassword === passwordConfirmation) {
          await createUserWithEmailAndPassword(
            auth,
            registerEmail,
            registerPassword
          ).then(() => {
            changeToLogin();
            setMessageStyle("text-green-600");
            setMessage("Register Succeded. Please login again!");
          });
        } else {
          setMessageStyle("text-red-600");
          setMessage("Password Confirmation is not the same");
        }
      } else {
        setMessageStyle("text-red-600");
        setMessage("Password must at least be 6 characters");
      }
    } catch (err) {
      setMessageStyle("text-red-600");
      setMessage("Invalid email");
      console.log(err);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err) {
      setMessageStyle("text-red-600");
      setMessage("Wrong Password or Email");
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setMessageStyle("text-red-600");
      setMessage("Google Authentication Failed");
    }
  };

  const resetMessage = () => {
    setMessageStyle("");
    setMessage("");
  };

  const changeToRegister = () => {
    setToggleLogin("hidden");
    setToggleRegister("flex");
    resetMessage();
  };

  const changeToLogin = () => {
    setToggleLogin("flex");
    setToggleRegister("hidden");
    resetMessage();
  };

  return (
    <div className="flex flex-col w-[420px] h-[480px] rounded-xl items-center bg-[#1E1F20] m-4 ">
      <div
        className={twMerge(
          "flex-col w-full h-full items-center space-y-4",
          toggleLogin
        )}
      >
        <h1 className="text-2xl text-white font-bold m-4 pt-4">
          Login To Play
        </h1>

        <div className="p-1 w-full h-12 flex justify-center">
          <button
            type="button"
            className="text-white bg-[#c05d56] hover:bg-[#c05d56]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-[#c05d56]/55 me-2 mb-2"
            onClick={signInWithGoogle}
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 19"
            >
              <path
                fillRule="evenodd"
                d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                clipRule="evenodd"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        <hr className="w-[80%] m-4 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="space-y-4 items-center flex flex-col m-3">
          <div className="flex items-center ml-[32px]">
            <input
              type="text"
              placeholder="Email... "
              className="block w-[300px] p-2 border-2 rounded-lg text-sm bg-[#131314] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <FaUser className="text-white absolute ml-[-32px] size-6" />
          </div>
          <div className="flex items-center ml-[32px]">
            <input
              type="password"
              placeholder="Password..."
              className="block w-[300px] p-2 border-2 rounded-lg text-sm bg-[#131314] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <FaLock className="text-white absolute ml-[-32px] size-6" />
          </div>

          <button
            type="button"
            className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700"
            onClick={signIn}
          >
            Login
          </button>

          <button className="text-gray-400 text-xs" onClick={changeToRegister}>
            Register A New Account
          </button>

          <p className={twMerge("m-2", messageStyle)}>{message}</p>
        </div>
      </div>

      <div
        className={twMerge(
          "flex-col w-full h-full items-center space-y-4",
          toggleRegister
        )}
      >
        <h1 className="text-2xl text-white font-bold m-4 pt-4">
          Register a New Account
        </h1>

        <div className="p-1 w-full h-12 flex justify-center">
          <button
            type="button"
            className="text-white bg-[#c05d56] hover:bg-[#c05d56]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-[#c05d56]/55 me-2 mb-2"
            onClick={signInWithGoogle}
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 19"
            >
              <path
                fillRule="evenodd"
                d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                clipRule="evenodd"
              />
            </svg>
            Register with Google
          </button>
        </div>

        <hr className="w-[80%] m-4 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="space-y-4 items-center flex flex-col m-3">
          <div className="flex items-center ml-[32px]">
            <input
              type="text"
              placeholder="Email... "
              className="block w-[300px] p-2 border-2 rounded-lg text-sm bg-[#131314] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <FaUser className="text-white absolute ml-[-32px] size-6" />
          </div>
          <div className="flex items-center ml-[32px]">
            <input
              type="password"
              placeholder="Password..."
              className="block w-[300px] p-2 border-2 rounded-lg text-sm bg-[#131314] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <FaLock className="text-white absolute ml-[-32px] size-6" />
          </div>
          <div className="flex items-center ml-[32px]">
            <input
              type="password"
              placeholder="Password Confirmation..."
              className="block w-[300px] p-2 border-2 rounded-lg text-sm bg-[#131314] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <AiOutlineRedo className="text-white absolute ml-[-32px] size-6" />
          </div>

          <button
            type="button"
            className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700"
            onClick={Register}
          >
            Register
          </button>

          <button className="text-gray-400 text-xs" onClick={changeToLogin}>
            Login Instead
          </button>

          <p className={twMerge("m-2", messageStyle)}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
