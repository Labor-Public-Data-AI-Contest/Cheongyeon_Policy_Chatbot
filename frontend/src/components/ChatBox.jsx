import { useState, useEffect, useRef } from "react";

function ChatBox() {
    const [messages, setMessages] = useState([
        { text: "안녕하세요!", sender: "bot" }
    ]);
    const [input, setInput] = useState("");

    const chatEndRef = useRef(null);

    // 자동 스크롤
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        setMessages(prev => [
            ...prev,
            { text: input, sender: "user" }
        ]);

        setInput("");
    };

    return (
        <div className="chat-container">

            {/*  header  */}
            <div className="chat-header">
                청년 지원 AI 도우미
            </div>

            {/* body */}
            <div className="chat-body">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={msg.sender === "user" ? "user" : "bot"}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>

            {/*  footer */}
            <div className="chat-footer">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="메시지를 입력하세요"
                />
                <button onClick={sendMessage}>전송</button>
            </div>

        </div>
    );
}

export default ChatBox;