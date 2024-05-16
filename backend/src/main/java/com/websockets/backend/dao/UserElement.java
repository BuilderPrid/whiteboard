package com.websockets.backend.dao;

import lombok.Data;

@Data
public class UserElement {
    private String email;
    private Element[] elements;

    public UserElement(String email, Element[] elements) {
        this.email = email;
        this.elements = elements;
    }
}
