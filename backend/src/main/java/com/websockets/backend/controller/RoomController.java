package com.websockets.backend.controller;

import org.springframework.web.bind.annotation.RestController;

import com.websockets.backend.models.Room;
import com.websockets.backend.services.RoomService;

import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "*")
public class RoomController {
    @Autowired
    private RoomService roomService;

    @PostMapping("/create-room")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return roomService.createRoom(room);
    }

    @PostMapping("/join-room")
    public ResponseEntity<Room> joinRoom(@RequestBody java.util.Map<String, String> roomObj) {
        System.out.println("trying join?" + roomObj.get("name"));
        return roomService.joinRoom(roomObj.get("name"));
    }

    @PostMapping("/leave-room")
    public ResponseEntity<String> leaveRoom(@RequestBody java.util.Map<String, String> roomName) {
        return roomService.leaveRoom(roomName.get("name"));
    }

}
