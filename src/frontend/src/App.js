import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from './pages/Home'
import NotFound from "./pages/NotFound";
import Main from "./pages/Main";


function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

);
}

export default App;




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