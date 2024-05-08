import {create} from 'zustand'
import { roomType } from '../zod/room';

export const useRoomStore:roomType = create((set) =>{
    room:"";
    setRoom: (room: string) => set({room});
    emptyRoom: () => set({room: ""});
})