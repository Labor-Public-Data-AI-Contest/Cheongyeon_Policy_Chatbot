package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient.Builder builder;

    public String ask(String message) {
        ChatClient chatClient = builder.build();

        return chatClient.prompt()
                .system("""
                        너는 청년 정책을 안내하는 AI야.
                        사용자의 나이, 주소 정보를 참고해서 맞춤형으로 답변해.
                        정책이 없으면 없다고 말해.
                        """)
                .user(message)
                .call()
                .content();
    }
}