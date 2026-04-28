import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function ChatBox() {
    const { isLogin } = useAuth();

    const [messages, setMessages] = useState([
        { text: "안녕하세요!", sender: "bot" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    useEffect(() => {
        setMessages([
            { text: "안녕하세요!", sender: "bot" }
        ]);
    }, [isLogin]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;

        setMessages(prev => [
            ...prev,
            { text: userMessage, sender: "user" }
        ]);

        setInput("");
        setIsLoading(true);

        try {
            let messageToAI = userMessage;

            try {
                const userRes = await api.get("/api/user/me");

                messageToAI = `
사용자 정보:
이름: ${userRes.data.name}
주소: ${userRes.data.address}
나이: ${userRes.data.age}

사용자 질문:
${userMessage}
`;
            } catch (error) {
                messageToAI = `
사용자 정보:
비로그인 상태

사용자 질문:
${userMessage}
`;
            }

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
        } finally {
            setIsLoading(false);
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

                {isLoading && (
                    <div className="bot typing">
                        답변 생성 중...
                    </div>
                )}

                <div ref={chatEndRef}></div>
            </div>

            <div className="chat-footer">
                <input
                    value={input}
                    disabled={isLoading}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder={isLoading ? "답변을 기다리는 중..." : "메시지를 입력하세요"}
                />
                <button onClick={sendMessage} disabled={isLoading}>
                    {isLoading ? "대기중" : "전송"}
                </button>
            </div>
        </>
    );
}

export default ChatBox;