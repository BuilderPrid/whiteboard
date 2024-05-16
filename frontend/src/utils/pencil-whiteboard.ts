
import React from 'react'

export default function usePencil() {
    
  return (
    <div>usePencil</div>
  )
}


export const startDrawing = (e: { offsetX: number; offsetY: number }) => {
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
          userTool: "pencil",
          userColor: myColor,
          userToolSize: 1,
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
      // console.log("drawing");
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          type: "draw",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          isDrawing: true,
          x: e.offsetX,
          y: e.offsetY,
          userTool: "pencil",
          userColor: myColor,
          userToolSize: 1,
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
          userTool: "pencil",
          userColor: myColor,
          userToolSize: 1,
          size: 1,
        }),
      });
    };