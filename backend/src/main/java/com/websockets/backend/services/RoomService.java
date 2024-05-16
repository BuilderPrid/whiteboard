package com.websockets.backend.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.websockets.backend.models.Room;
import com.websockets.backend.repositories.RoomDao;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class RoomService {
    @Autowired
    private RoomDao roomDao;

    public ResponseEntity<Room> createRoom(Room room) {
        try {
            if (roomDao.findByName(room.getName()) != null) {
                return ResponseEntity.status(409).body(null);
            }
            roomDao.save(room);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity<Room> joinRoom(String roomName) {
        try {
            System.out.println("joinning ropom?");
            Room room = roomDao.findByName(roomName);
            if (room == null) {
                System.out.println("joinning ropom?fail");

                return ResponseEntity.status(404).body(null);
            }
            room.setPlayerCount(room.getPlayerCount() + 1);
            roomDao.save(room);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    public ResponseEntity<String> leaveRoom(String roomName) {
        try {
            Room room = roomDao.findByName(roomName);
            if (room == null) {
                return ResponseEntity.status(404).body("Room not found");
            }
            room.setPlayerCount(room.getPlayerCount() - 1);
            if (room.getPlayerCount() == 0) {
                roomDao.delete(room);
                return ResponseEntity.ok("Room deleted successfully");
            } else {
                roomDao.save(room);
                return ResponseEntity.ok("Room left successfully");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error leaving room");
        }
    }

}
