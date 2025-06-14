package com.example.ems.dto;

public class ChatbotResponseDTO {
    private String reply;

    public ChatbotResponseDTO(String reply) { this.reply = reply; }
    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }
}