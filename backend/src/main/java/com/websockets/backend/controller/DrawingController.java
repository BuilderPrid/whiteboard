package com.websockets.backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.messaging.handler.annotation.SendTo;

import com.websockets.backend.dao.Element;
import com.websockets.backend.dao.UserElement;
import com.websockets.backend.models.DrawingTool;

@Controller
public class DrawingController {

    @MessageMapping("/draw")
    @SendTo("/topic/drawing")
    public DrawingTool draw(DrawingTool drawingToolData) {
        // System.out.println("Drawing tool data received: " + drawingToolData.getX() +
        // ' ' + drawingToolData.getY());
        // System.out.println(drawingToolData.toString());
        return drawingToolData;

    }

    @MessageMapping("/elements/")
    @SendTo("/topic/elements")
    public UserElement elements(UserElement element) {
        // System.out.println("Element: " + elements[0].getTool() + ' ' +
        // elements[0].getOffsetX() + email);
        // Create an instance of UserElement using the constructor
        System.err.println(element.getElements().toString());
        return element;
    }
}