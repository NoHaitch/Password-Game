import { useState } from "react";
import { auth, googleProvider } from "../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FaUser, FaLock } from "react-icons/fa";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col w-[420px] h-[440px] rounded-xl items-center justify-center bg-[#1E1F20] m-4 space-y-4">
      <h1 className="text-2xl text-white font-bold m-4">Login To Play</h1>

      <div className="p-1 w-full h-12 flex justify-center">
        <button
          type="button"
          class="text-white bg-[#c05d56] hover:bg-[#c05d56]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center focus:ring-[#c05d56]/55 me-2 mb-2"
          onClick={signInWithGoogle}
        >
          <svg
            class="w-4 h-4 me-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 19"
          >
            <path
              fill-rule="evenodd"
              d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
              clip-rule="evenodd"
            />
          </svg>
          Sign in with Google
        </button>
      </div>

      <hr class="w-[80%] m-2 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>

      <div className="flex items-center ml-[32px]">
        <input
          type="text"
          id="email"
          placeholder="Email... "
          className="block w-[300px] p-2 border-2 rounded-lg text-sm bg-[#131314] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        />
        <FaUser className="text-white absolute ml-[-32px] size-6" />
      </div>
      <div className="flex items-center ml-[32px]">
        <input
          type="password"
          id="password"
          placeholder="Password..."
          className="block w-[300px] p-2 border-2 rounded-lg text-sm bg-[#131314] border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
        />
        <FaLock className="text-white absolute ml-[-32px] size-6" />
      </div>

      <button
        type="button"
        className="text-white focus:outline-none focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700"
      >
        Login
      </button>

      <p className="text-gray-400 text-xs">Register A New Account</p>

      {/* <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signIn}>Sign In</button>

      <button onClick={signInWithGoogle}>Sign in with google</button> */}
    </div>
  );
};

export default Auth;
