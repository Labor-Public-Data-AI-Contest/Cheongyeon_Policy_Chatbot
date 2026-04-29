package com.example.backend.service;

import com.example.backend.dto.ChatResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient.Builder builder;
    private final ObjectMapper objectMapper;

    public ChatResponseDto ask(String message) {
        ChatClient chatClient = builder.build();

        String result = chatClient.prompt()
                .system("""
                        너는 청년 정책을 안내하는 AI 도우미야.

                        반드시 JSON 형식으로만 답변해.
                        설명 문장, 마크다운, ```json 같은 코드블록은 절대 쓰지 마.

                        응답 형식:
                        {
                          "type": "policies",
                          "text": "",
                          "policies": [
                            {
                              "id": "임시ID",
                              "title": "정책명",
                              "region": "지역",
                              "amount": "지원 내용 또는 금액",
                              "deadline": "신청 기간 또는 상시",
                              "reason": "사용자 조건과 맞는 이유"
                            }
                          ]
                        }

                        정책 추천이 아니라 일반 대화라면:
                        {
                          "type": "text",
                          "text": "답변 내용",
                          "policies": []
                        }

                        사용자의 나이, 주소 정보를 참고해.
                        모르는 내용은 추측하지 말고 "정확한 확인이 필요합니다"라고 적어.
                        """)
                .user(message)
                .call()
                .content();

        try {
            return objectMapper.readValue(result, ChatResponseDto.class);
        } catch (Exception e) {
            ChatResponseDto fallback = new ChatResponseDto();
            fallback.setType("text");
            fallback.setText(result);
            fallback.setPolicies(List.of());
            return fallback;
        }
    }
}