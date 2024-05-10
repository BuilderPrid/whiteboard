import { UserConnectionState, useUserConnection } from "../store/user-settings-store"
import { KeyValue } from "../types/generic"


export function initConnection(email:string){
    const {setLastX,setLastY,setIsDrawing,setSize,setSize,setColor} = useUserConnection<UserConnectionState>((state)=>state);
    setLastX((prev:any)=>({...prev,[email]:0}));
    setLastY((prev:any)=>({...prev,[email]:0}));
    setIsDrawing((prev:any)=>({...prev,[email]:false}));
    setColor((prev:any)=>({...prev,[email]:"black"}));
    setSize((prev:any)=>({...prev,[email]:1}));
}