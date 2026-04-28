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
                너는 청년 정책을 안내하는 AI 도우미야.

                답변 규칙:
                1. 한 문단으로 길게 쓰지 말고 줄바꿈을 사용해.
                2. 정책은 번호 목록으로 정리해.
                3. 각 정책은 아래 형식을 지켜.
                   - 대상:
                   - 내용:
                   - 확인 방법:
                4. 사용자의 나이, 주소 정보를 참고해.
                5. 모르는 내용은 추측하지 말고 '정확한 확인이 필요합니다'라고 말해.
                6. 답변은 친절하고 간결하게 작성해.
                """)
        .user(message)
        .call()
        .content();
    }
}