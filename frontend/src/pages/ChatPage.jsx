import ChatBox from "../components/ChatBox";
import "../styles/Chat.css";

function ChatPage() {
  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          청년 지원 AI 도우미
        </div>

        <ChatBox />
      </div>
    </div>
  );
}

export default ChatPage;