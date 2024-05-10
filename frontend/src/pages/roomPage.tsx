import React from 'react'
import Whiteboard from '../components/whiteboard'
import { useParams } from 'react-router-dom'

export default function RoomPage() {
  const {roomId} = useParams<{roomId: string}>();
  console.log(roomId);
  return (
    <div>RoomPage
        <Whiteboard />
    </div>
  )
}
