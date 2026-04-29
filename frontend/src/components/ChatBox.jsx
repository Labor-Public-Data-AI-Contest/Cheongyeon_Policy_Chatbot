import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const initialMessages = [
    { text: "안녕하세요!", sender: "bot", type: "text" }
];

function ChatBox() {
    const { isLogin } = useAuth();

    const storageKey = isLogin ? "userChatMessages" : "guestChatMessages";

    const [messages, setMessages] = useState(() => {
        const token = localStorage.getItem("token");
        const key = token ? "userChatMessages" : "guestChatMessages";
        const saved = localStorage.getItem(key);

        return saved ? JSON.parse(saved) : initialMessages;
    });

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const chatEndRef = useRef(null);
    const prevStorageKeyRef = useRef(storageKey);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // 새로고침 대비 저장
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(messages));
    }, [messages]);

    // 로그인 <-> 비로그인 상태가 바뀔 때만 채팅 초기화
    useEffect(() => {
        if (prevStorageKeyRef.current !== storageKey) {
            localStorage.removeItem("guestChatMessages");
            localStorage.removeItem("userChatMessages");

            setMessages(initialMessages);
            localStorage.setItem(storageKey, JSON.stringify(initialMessages));

            prevStorageKeyRef.current = storageKey;
        }
    }, [storageKey]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;

        setMessages(prev => [
            ...prev,
            { text: userMessage, sender: "user", type: "text" }
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
                    sender: "bot",
                    type: chatRes.data.type,
                    text: chatRes.data.text,
                    policies: chatRes.data.policies || [],
                    followUp: chatRes.data.followUp || []
                }
            ]);

        } catch (error) {
            console.error("채팅 오류:", error);

            setMessages(prev => [
                ...prev,
                {
                    text: "답변을 가져오는 중 오류가 발생했어요.",
                    sender: "bot",
                    type: "text"
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="chat-body">
                {messages.map((msg, i) => {
                    if (msg.type === "policies") {
                        return (
                            <div key={i} className="policy-list">
                                {msg.policies.map((policy) => (
                                    <div className="policy-card" key={policy.id}>
                                        <div className="policy-card-header">
                                            <h3>{policy.title}</h3>
                                            {/* <button type="button">⭐</button> */}
                                        </div>

                                        <p className="policy-reason">
                                            {policy.reason}
                                        </p>

                                        <div className="policy-info">
                                            <span>지역: {policy.region}</span>
                                            <span>지원: {policy.amount}</span>
                                            <span>마감: {policy.deadline}</span>
                                        </div>
                                        {policy.url && (
                                            <a
                                                href={policy.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="policy-link"
                                            >
                                                신청하러 가기 →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    }

                    return (
                        <div
                            key={i}
                            className={msg.sender === "user" ? "user" : "bot"}
                        >
                            {msg.text}
                        </div>
                    );
                })}

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