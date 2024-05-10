import { createContext } from "react";

type KeyValue<T> ={
    [key:string]:T
}

type UserConnectionContextType = {
    connected: boolean;
    connectToSocket: () => void;
};
const UserConnectionContext = createContext(null);

const UserConnectionProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [lastX, setLastX] = React.useState<KeyValue<number>>({});
    const [lastY, setLastY] = React.useState<KeyValue<number>>({});
    const [isDrawing, setIsDrawing] = React.useState<KeyValue<boolean>>({});
    const [tool, setTool] = React.useState<KeyValue<string>>({});
    const [color, setColor] = React.useState<KeyValue<string>>({});
    const [size, setSize] = React.useState<KeyValue<number>>({});
    // Your code here
    return <UserConnectionContext.Provider value={{
        lastX,
    }}>{children}</UserConnectionContext.Provider>;
};
