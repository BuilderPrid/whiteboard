import React from "react";
import RoomForm from "../components/room-form";
export default function CreateRoom() {
  return (
    <div className="flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen flex-grow justify-center items-center">
      <RoomForm page="create" />
    </div>
  );
}
