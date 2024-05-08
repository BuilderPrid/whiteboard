import React, { createContext } from "react";
import { Stomp, Client } from "@stomp/stompjs";
import SockJs from "sockjs-client";
// Object.assign(globalThis, { WebSocket });
type contextType = {
  stompClient: Client | null;
  connected: boolean;
};

const StompContext = createContext<contextType | null>(null);

const StompProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [stompClient, setStompClient] = React.useState<Client | null>(null);
  const [connected, setConnected] = React.useState(false);
  const connectToSocket = async () => {
    console.log("Connecting to socket");
    let client = null;
    const socket = new SockJs("http://localhost:8080/ws-draw");
    client = Stomp.over(socket);
    client.connect(
      {},
      () => {
        setConnected(true);
        setStompClient(client);
        console.log("Connected to socket");
        client.publish("/app/draw",)
      },
      (error: Error) => {
        console.log("Error connecting to socket", error);
      }
    );
  };
  React.useEffect(() => {
    try {
      connectToSocket();
    } catch (e) {
      console.log(e);
    }
    return () => {
      stompClient?.deactivate();
    };
  }, []);

  return (
    <StompContext.Provider value={{ stompClient, connected }}>
      {children}
    </StompContext.Provider>
  );
};

export const useStomp = () => {
  const context = React.useContext(StompContext);
  if (!context)
    throw new Error("useSocket must be used within a StompProvider");
  return context;
};

export default StompProvider;
