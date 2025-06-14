package com.example.ems.dto;

public class ChatbotRequestDTO {
    private String message;
    private String language;
    private String role;

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}