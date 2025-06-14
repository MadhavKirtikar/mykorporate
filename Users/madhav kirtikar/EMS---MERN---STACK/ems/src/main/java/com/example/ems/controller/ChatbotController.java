package com.example.ems.controller;

import com.example.ems.dto.ChatbotRequestDTO;
import com.example.ems.dto.ChatbotResponseDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @PostMapping("/send")
    public ResponseEntity<ChatbotResponseDTO> sendMessage(@RequestBody ChatbotRequestDTO payload) {
        String message = payload.getMessage();
        String language = payload.getLanguage();
        String role = payload.getRole();

        String reply = "You said: " + message + " (Language: " + language + ", Role: " + role + ")";
        return ResponseEntity.ok(new ChatbotResponseDTO(reply));
    }
}