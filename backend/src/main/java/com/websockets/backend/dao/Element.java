package com.websockets.backend.dao;

import java.util.List;

import lombok.Data;

@Data
public class Element {
    private String tool;
    private int offsetX;
    private int offsetY;
    private int width;
    private int height;
    private String stroke;
    private int strokeWidth;
    private List<List<Integer>> path;
}
