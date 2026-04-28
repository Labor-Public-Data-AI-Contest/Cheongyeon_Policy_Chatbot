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
            let messageToAI = userMessage;

            // 로그인 정보 가져오기
            try {
                const userRes = await api.get("/api/user/me");

                console.log("내 정보:", userRes.data);

                messageToAI = `
사용자 정보:
이름: ${userRes.data.name}
주소: ${userRes.data.address}
나이: ${userRes.data.age}

사용자 질문:
${userMessage}
`;
            } catch (error) {
                console.log("비로그인 상태");

                messageToAI = `
사용자 정보:
비로그인 상태

사용자 질문:
${userMessage}
`;
            }

            // OpenAI 연결된 Spring API 호출
            const chatRes = await api.post("/api/chat", messageToAI, {
                headers: {
                    "Content-Type": "text/plain"
                }
            });

            setMessages(prev => [
                ...prev,
                {
                    text: chatRes.data,
                    sender: "bot"
                }
            ]);

        } catch (error) {
            console.error("채팅 오류:", error);

            setMessages(prev => [
                ...prev,
                {
                    text: "답변을 가져오는 중 오류가 발생했어요.",
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