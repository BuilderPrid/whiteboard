import {create} from 'zustand'
type KeyValue<T> ={
    [key:string]:T
}

export const useUserConnection = create<UserConnectionState>((set) => ({
    lastX:{},
    setLastX: (lastX:KeyValue<number> ) => set({lastX}),
    lastY:{},
    setLastY: (lastY:KeyValue<number> ) => set({lastY}),
    isDrawing:{},
    setIsDrawing: (isDrawing:KeyValue<boolean>) => set({isDrawing}),
    tool:{},
    setTool: (tool: KeyValue<string>) => set({tool}),
    color:{},
    setColor: (color: KeyValue<string>) => set({color}),
    size:{},
    setSize: (size: KeyValue<number>) => set({size}),
}));


export type UserConnectionState = {
  lastX: KeyValue<number>;
  setLastX: (lastX: KeyValue<number>) => void;
  lastY: KeyValue<number>;
  setLastY: (lastY: KeyValue<number>) => void;
  isDrawing: KeyValue<boolean>;
  setIsDrawing: (isDrawing: KeyValue<boolean>) => void;
  tool: KeyValue<string>;
  setTool: (tool: KeyValue<string>) => void;
  color: KeyValue<string>;
  setColor: (color: KeyValue<string>) => void;
  size: KeyValue<number>;
  setSize: (size: KeyValue<number>) => void;
}