package com.example.backend.service;

import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ChatResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatClient.Builder builder;
    private final ObjectMapper objectMapper;

    public ChatResponseDto ask(String message) {

        if (message.contains("주거")) {
            message = "청년 주거 지원 정책을 최소 1개 이상 추천해줘. 카테고리를 다시 묻지 마.";
        } else if (message.contains("취업")) {
            message = "청년 취업 지원 정책을 최소 1개 이상 추천해줘. 카테고리를 다시 묻지 마.";
        } else if (message.contains("창업")) {
            message = "청년 창업 지원 정책을 최소 1개 이상 추천해줘. 카테고리를 다시 묻지 마.";
        }

        ChatClient chatClient = builder.build();

        String result = chatClient.prompt()
                .system("""
                        너는 청년 정책을 안내하는 AI 도우미야.

                        반드시 JSON 형식으로만 답변해.
                        설명 문장, 마크다운, ```json 같은 코드블록은 절대 쓰지 마.

                        ====================
                        응답 형식 (정책 추천일 때)
                        ====================
                        {
                          "type": "policies",
                          "text": "추천 요약 또는 안내 문장",
                          "policies": [
                            {
                              "id": "임시ID",
                              "title": "정책명",
                              "region": "지역",
                              "amount": "지원 내용 또는 금액",
                              "deadline": "신청 기간 또는 상시",
                              "reason": "사용자 조건과 맞는 이유",
                              "url": "신청 페이지 또는 공식 사이트 URL"
                            }
                          ],
                          "followUp": [
                            "추가 질문1",
                            "추가 질문2"
                          ]
                        }

                        ====================
                        응답 형식 (카테고리 선택이 필요할 때)
                        ====================
                        {
                          "type": "text",
                          "text": "어떤 분야의 청년 정책을 찾고 계신가요?",
                          "policies": [],
                          "followUp": [
                            "주거 지원 정책 알려줘",
                            "취업 지원 정책 알려줘",
                            "창업 지원 정책 알려줘"
                          ]
                        }

                        ====================
                        응답 형식 (일반 대화일 때)
                        ====================
                        {
                          "type": "text",
                          "text": "답변 내용",
                          "policies": [],
                          "followUp": []
                        }

                        ====================
                        응답 타입 결정 규칙
                        ====================
                        - 사용자의 질문이 청년 정책 관련이면 정책 질문으로 판단해.
                        - 질문이 너무 포괄적이면 카테고리 질문을 해.

                        - 주거 관련 키워드 → 주거 정책 추천
                        - 취업 관련 키워드 → 취업 정책 추천
                        - 창업 관련 키워드 → 창업 정책 추천
                        - 교육 관련 키워드 → 교육 정책 추천

                        ====================
                        정책 추천 규칙
                        ====================
                        - 카테고리가 명확하면 반드시 정책을 1개 이상 포함해.
                        - 절대 카테고리 질문을 반복하지 마.
                        - 정책은 최대 3개까지만 추천해.

                        ====================
                        기타 규칙
                        ====================
                        - 모든 응답은 JSON 하나만 반환해.
                        - JSON 외 텍스트 절대 금지.
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
            fallback.setFollowUp(List.of());
            return fallback;
        }
    }
}