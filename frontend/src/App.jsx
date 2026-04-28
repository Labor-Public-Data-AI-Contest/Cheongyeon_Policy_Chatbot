import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";

import "./App.css";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved === "true") setDark(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("dark", dark);
  }, [dark]);

  return (
    <div className={dark ? "dark" : ""}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatPage dark={dark} setDark={setDark} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;