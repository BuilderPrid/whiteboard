package com.websockets.backend.models;


import lombok.Data;

@Data
public class DrawingTool {
    private String userTool;
    private String type;
    private String userEmail;
    private boolean userIsDrawing;
    private String userColor;
    private int userToolSize;
    private int x;
    private int y;
    
} 