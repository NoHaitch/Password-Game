import "./App.css";
import Auth from "./components/Authentication";
import PasswordField from "./components/PasswordField";
import useSignOut from "./hooks/UseSignout";

function App() {
  return (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="w-screen h-screen bg-[url('../public/background.jpg')] absolute top-0 left-0 -z-10 opacity-25"></div>
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
      <div className="m-8">
        <Auth />
      </div>
    </div>

    // <div className="flex w-screen h-screen justify-center">
    //   <div className="flex flex-col h-screen w-[90%] items-center p-6">
    //     <div className="text-center">
    //       <h1 className="text-5xl text-white font-title m-4">The Password Game</h1>
    //       <h2 className="text-xl text-white font-mono">inspired by the <a href="https://neal.fun/password-game/" className="underline">original</a></h2>
    //     </div>
    //     <div className="content m-4">
    //       <PasswordField />
    //     </div>
    //   </div>
    //   <div className="bg-red-300 p-3">
    //     <Auth />
    //   </div>

    // </div>
  );
}

export default App;
