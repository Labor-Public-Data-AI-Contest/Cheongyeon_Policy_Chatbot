import Header from "../components/Header";
import ChatBox from "../components/ChatBox";
import "../styles/Chat.css";

function ChatPage({ dark, setDark }) {
  return (
    <div className="chat-page">
      <div className="chat-container">
        <Header dark={dark} setDark={setDark} />
        <ChatBox />
      </div>
    </div>
  );
}

export default ChatPage;