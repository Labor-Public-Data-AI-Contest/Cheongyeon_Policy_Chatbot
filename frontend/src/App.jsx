import { useState, useEffect } from "react";
import ChatPage from "./pages/ChatPage";

function App() {
  const [dark, setDark] = useState(false);
  // 처음 로드 시 저장값 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("dark");
    if (saved === "true") setDark(true);
  }, []);

  // 상태 변경 시 저장
  useEffect(() => {
    localStorage.setItem("dark", dark);
  }, [dark]);

  return (
    <div className={dark ? "dark" : ""}>
      <button
        onClick={() => setDark(!dark)}
        style={{
          position: "absolute",
          top: 10,
          right: 20,
          padding: "8px 12px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer"
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      <ChatPage />
    </div>
  );
}

export default App;