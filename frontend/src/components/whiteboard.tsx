import React, { useEffect, useLayoutEffect } from "react";
import { useStomp } from "../contexts/stomp-context";
import { useUser } from "@clerk/clerk-react";
import { useUserConnection, usersStore } from "../store/user-settings-store";
import { UserConnectionState } from "../store/user-settings-store";
import ControlPanel from "./control-panel";
import useRectangle from "../hooks/useRectangle";
import usePencil from "../hooks/usePencil";
import rough from "roughjs";
import { WhiteboardElementType } from "../zod/whiteboard-elements";
import { RoughCanvas } from "roughjs/bin/canvas";

import { drawFigures } from "../utils/drawing-utils";
import { KeyValue } from "../types/generic";
export default function Whiteboard() {
  const { user,isLoaded } = useUser();
  const { setUserElements, userElements } = usersStore();
  const { stompClient, connected } = useStomp();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const roughCanvasRef = React.useRef<RoughCanvas>();
  const [myColor, setMyColor] = React.useState("black");
  const [myTool, setMyTool] = React.useState("pencil");
  const [elements, setElements] = React.useState<WhiteboardElementType[]>([]);
  const { setPencilListeners, removePencilListeners } = usePencil({
    canvasRef: canvasRef,
    myColor: myColor,
    myTool: myTool,
    roughRef: roughCanvasRef,
    setElements: setElements,
  });
  const { setRectangleListeners, removeRectangleListeners } = useRectangle({
    canvasRef: canvasRef,
    myTool: myTool,
    myColor: myColor,
    roughRef: roughCanvasRef,
    setElements: setElements,
    elements: elements,
  });
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
  useEffect(() => {
    stompClient?.subscribe("/topic/elements", (message) => {
      const { email, elements } = JSON.parse(message.body);
      setUserElements(email, elements);
    });
  }, []);
  useEffect(() => {
    // Object.entries(userElements).forEach(([email, elements]) => {
    //   // console.log(Object.entries(userElements).length, "user elements",userElements);
    //   drawFigures(elements, roughCanvasRef);
    // });
    console.log(userElements, "user elements");
  }, [userElements]);
  useEffect(() => {
stompClient?.publish({
      destination: `/app/elements/`,
      body: JSON.stringify({
        email: user?.primaryEmailAddress?.emailAddress,
        elements,
      }),
    });
  },[elements]);

  React.useEffect(() => {
    // console.log("white board rerender");
    stompClient?.subscribe("/topic/drawing", (message) => {
      const {
        x,
        y,
        userEmail,
        userColor,
        type,
      }: {
        x: number;
        y: number;
        userEmail: string;
        userColor: string;
        type: string;
      } = JSON.parse(message.body);
      if (userEmail === user?.primaryEmailAddress?.emailAddress) return;
      if (type == "end") {
        setIsDrawing((prev) => ({ ...prev, [userEmail]: false }));
        return;
      }
      if (type === "start") {
        // console.log(JSON.parse(message.body));
        // console.log("user started");
        setIsDrawing((prev: KeyValue<boolean>) => ({
          ...prev,
          [userEmail]: true,
        }));
        setLastX((prev: any) => ({ ...prev, [userEmail]: x }));
        setLastY((prev: any) => ({ ...prev, [userEmail]: y }));
        setTool((prev: any) => ({ ...prev, [userEmail]: "pencil" }));
        setColor((prev: any) => ({ ...prev, [userEmail]: userColor }));
        if (ctx) {
          ctx.strokeStyle = userColor;
          console.log(
            "color change",
            userColor,
            ctx.strokeStyle,
            ctx.lineWidth
          );
        }
        setSize((prev: any) => ({ ...prev, [userEmail]: 1 }));
        return;
      } else if (type == "draw") {
        // console.log(isDrawing[userEmail], userEmail, "isDrawing");
        // if (!isDrawing[userEmail as string]) return;
        // if (!isDrawing[userEmail]) return;
        // console.log("user drawing", x, y);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
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

    const canvas = canvasRef.current;
    roughCanvasRef.current = rough.canvas(canvas as HTMLCanvasElement);
    const ctx = canvas?.getContext("2d");
    {
      myTool === "pencil" && setPencilListeners();
    }
    {
      myTool === "rectangle" && setRectangleListeners();
    }
    return () => {
      {
        myTool === "pencil" && removePencilListeners();
      }
      {
        myTool === "rectangle" && removeRectangleListeners();
      }
    };
  }, [myColor, myTool]);

  useLayoutEffect(() => {
    if (elements.length) {
      if (!canvasRef) return;
      canvasRef.current
        ?.getContext("2d")
        ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    drawFigures(elements, roughCanvasRef);

    console.log(
      userElements[user?.primaryEmailAddress?.emailAddress as string]
    );
    Object.entries(userElements).forEach(([email, element]) => {
      // console.log(element, "user elements");
      drawFigures(element, roughCanvasRef);
    });
  }, [elements,userElements]);
  if (!connected && !isLoaded) return <div>Connecting...</div>;
  return (
    <div className="bg-red-400">
      <canvas
        ref={canvasRef}
        width={window.innerWidth - 40}
        height={window.innerHeight - 40}
        className="m-4 bg-gray-50 border-2 border-gray-900"
      ></canvas>
      <ControlPanel setMyTool={setMyTool} setMyColor={setMyColor} />
    </div>
  );
}
