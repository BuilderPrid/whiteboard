import React from "react";
import { useStomp } from "../contexts/stomp-context";
import { useUser } from "@clerk/clerk-react";
import { useUserConnection } from "../store/user-settings-store";
import { UserConnectionState } from "../store/user-settings-store";

export default function Whiteboard() {
  const { user } = useUser();
  const { stompClient, connected } = useStomp();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const {
    lastX,
    setLastX,
    lastY,
    setLastY,
    isDrawing,
    setIsDrawing,
    tool,
    setTool,
    color,
    setColor,
    size,
    setSize,
  } = useUserConnection<UserConnectionState>((state) => state);
  // const [myLastX, setMyLastX] = React.useState(0);
  // const [myLastY, setMyLastY] = React.useState(0);
  // const [myIsDrawing, setMyIsDrawing] = React.useState(false);
  // const [myTool, setMyTool] = React.useState("pencil");
  // const [myColor, setMyColor] = React.useState("black");
  // const [mySize, setMySize] = React.useState(1);
  // const lastX = useUserConnection((state:UserConnectionState) => state.lastX);
  // Access state values
  // console.log("Last X:", lastX);
  // console.log("Last Y:", lastY);
  // console.log(
  //   "Is Drawing:",
  //   isDrawing[user?.primaryEmailAddress?.emailAddress as string]
  // );
  // console.log("Tool:", tool);
  // console.log("Color:", color);
  // console.log("Size:", size);

  // const {lastX,lastY,setLastX,setLastY,setIsDrawing} = useUserConnection(state=>state);
  // const setLastX = useUserConnection((state) => state.setLastX);
  // setLastX((prev:any)=>({...prev,[user?.primaryEmailAddress?.emailAddress as string]:0}));
  // setLastY((prev:any)=>({...prev,[user?.primaryEmailAddress?.emailAddress as string]:0}));
  // setIsDrawing((prev:any)=>({...prev,[user?.primaryEmailAddress?.emailAddress as string]:false}));
  React.useEffect(() => {
    // Variables to store drawing state
    // console.log(lastX, lastY, "lastX,lastY");
    let myIsDrawing = false;
    let myLastX = 0;
    let myLastY = 0;
    // let lastX2 = 0;
    // let lastY2 = 0;
    stompClient?.subscribe("/topic/drawing", (message) => {
      // const {x,y} = JSON.parse(;

      const {
        x,
        y,
        userEmail,
        color,
        type,
      }: {
        x: number;
        y: number;
        userEmail: string;
        color: string;
        type: string;
      } = JSON.parse(message.body);
      // console.log(JSON.parse(message.body).type);
      if (userEmail === user?.primaryEmailAddress?.emailAddress) return;
      // console.log(type);
      // console.log("Drawing", x, y);
      if (type == "end") {
        console.log("user ended");
        setIsDrawing((prev: any) => ({ ...prev, [userEmail]: false }));
        return;
      }
      if (type === "start") {
        console.log("user started");
        setIsDrawing((prev: any) => ({ ...prev, [userEmail]: true }));
        setLastX((prev: any) => ({ ...prev, [userEmail]: x }));
        setLastY((prev: any) => ({ ...prev, [userEmail]: y }));
        setTool((prev: any) => ({ ...prev, [userEmail]: "pencil" }));
        setColor((prev: any) => ({ ...prev, [userEmail]: "black" }));
        setSize((prev: any) => ({ ...prev, [userEmail]: 1 }));
        return;
      } else if (type == "draw") {
        console.log(isDrawing[userEmail], userEmail, "isDrawing");
        // if (!isDrawing[userEmail as string]) return;
        // if (!isDrawing[userEmail]) return;
        console.log("user drawing", x, y);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(lastX[userEmail], lastY[userEmail]);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        setLastX((prev: any) => ({ ...prev, [userEmail]: x }));
        setLastY((prev: any) => ({ ...prev, [userEmail]: y }));
        // [lastX, lastY2] = [x, y];
      }
    });
    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      // setIsDrawing((prev: any) => ({
      //   ...prev,
      //   [user?.primaryEmailAddress?.emailAddress as string]: true,
      // }));
      myIsDrawing = true;
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          type: "start",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          isDrawing: true,
          x: e.offsetX,
          y: e.offsetY,
          tool: "pencil",
          color: "pink",
          size: 1,
        }),
      });
      [myLastX, myLastY] = [e.offsetX, e.offsetY];
      // setLastX((prev: any) => ({
      //   ...prev,
      //   [user?.primaryEmailAddress?.emailAddress as string]: e.offsetX,
      // }));
      // setLastY((prev: any) => ({
      //   ...prev,
      //   [user?.primaryEmailAddress?.emailAddress as string]: e.offsetY,
      // }));
    };

    // // Function to draw
    const draw = (e: { offsetX: number; offsetY: number }) => {
      if (!myIsDrawing) return;
      console.log("drawing");
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          type: "draw",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          isDrawing: true,
          x: e.offsetX,
          y: e.offsetY,
          tool: "pencil",
          color: "pink",
          size: 1,
        }),
      });
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(myLastX, myLastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }

      [myLastX, myLastY] = [e.offsetX, e.offsetY];
    };

    // // Function to end drawing
    const endDrawing = () => {
      myIsDrawing = false;
      // setIsDrawing((prev: any) => ({
      //   ...prev,
      //   [user?.primaryEmailAddress?.emailAddress as string]: false,
      // }));
      // isDrawing[user?.primaryEmailAddress?.emailAddress as string] = false;
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          type: "end",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          isDrawing: false,
          x: 0,
          y: 0,
          tool: "pencil",
          color: "black",
          size: 1,
        }),
      });
    };

    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx = canvasRef.current?.getContext("2d");

    // Set initial drawing styles
    if (ctx) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
    // Event listeners for drawing
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mouseout", endDrawing);
    console.log("events done");

    return () => {
      // Clean up event listeners when component unmounts
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mouseout", endDrawing);
    };
  }, [stompClient]);
  if (!connected) return <div>Connecting...</div>;
  return (
    <div className="bg-red-400">
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 40}
        height={window.innerHeight - 40}
        className="m-4 bg-gray-50 border-2 border-gray-900"
      ></canvas>
    </div>
  );
}
