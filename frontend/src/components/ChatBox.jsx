import { useState, useEffect, useRef } from "react";
import api from "../api/axios";

function ChatBox() {
    const [messages, setMessages] = useState([
        { text: "안녕하세요!", sender: "bot" }
    ]);
    const [input, setInput] = useState("");

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input;

        setMessages(prev => [
            ...prev,
            { text: userMessage, sender: "user" }
        ]);

        setInput("");

        try {
            const res = await api.get("/api/user/me");

            console.log("내 정보:", res.data);

            setMessages(prev => [
                ...prev,
                {
                    text: `안녕하세요 ${res.data.name}님! 현재 ${res.data.address} 거주, ${res.data.age}세로 확인됐어요.`,
                    sender: "bot"
                }
            ]);
        } catch (error) {
            console.log("비로그인 상태");

            setMessages(prev => [
                ...prev,
                {
                    text: "로그인하면 나이, 주소 정보를 바탕으로 더 맞춤형 답변을 받을 수 있어요.",
                    sender: "bot"
                }
            ]);
        }
    };

    return (
        <>
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
        </>
    );
}

export default ChatBox;