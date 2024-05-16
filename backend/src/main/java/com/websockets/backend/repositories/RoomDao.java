package com.websockets.backend.repositories;
import com.websockets.backend.models.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface RoomDao extends JpaRepository<Room, Integer>{
    public Room findByName(String name);
}
