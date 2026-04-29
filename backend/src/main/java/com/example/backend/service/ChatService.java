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
                          응답 형식 (일반 대화일 때)
                          ====================
                          {
                            "type": "text",
                            "text": "답변 내용",
                            "policies": [],
                            "followUp": []
                          }

                          ====================
                          followUp 생성 규칙
                          ====================
                          - 정책 추천과 관련 있는 질문이면 followUp을 1~3개 생성해.
                          - 사용자에게 부족한 정보만 질문해.
                          - 이미 사용자가 말한 정보는 절대 다시 묻지 마.
                          - 질문은 짧고 자연스럽게 만들어.
                          - 주로 아래 정보를 물어봐:
                            나이, 거주지, 취업 여부, 소득 수준, 재학 여부, 관심 분야
                          - 정책과 무관한 일반 대화면 followUp은 반드시 빈 배열로 해.

                          ====================
                          정책 생성 규칙
                          ====================
                          - 실제 존재할 가능성이 높은 정책만 생성해.
                          - 모르면 "정확한 확인이 필요합니다"라고 적어.
                          - 절대 추측해서 허위 정책을 만들지 마.

                          - url 규칙:
                            - 실제 신청 페이지 또는 공식 사이트 링크를 넣어.
                            - 정확한 URL을 모르면 빈 문자열("")로 반환해.

                          ====================
                          기타 규칙
                          ====================
                          - 사용자의 나이, 주소 등의 정보를 최대한 활용해.
                          - 모든 응답은 JSON 하나만 반환해.
                          - JSON 외의 텍스트는 절대 포함하지 마.
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