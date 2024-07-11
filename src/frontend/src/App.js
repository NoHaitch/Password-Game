import { Route, Routes } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";
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
