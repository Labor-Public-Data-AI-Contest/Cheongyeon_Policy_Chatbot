package com.example.backend.controller;

import com.example.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public String chat(@RequestBody String message) {
        return chatService.ask(message);
    }
}