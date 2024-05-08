import React from "react";
import { useStomp } from "../contexts/stomp-context";

export default function Whiteboard() {
  const { stompClient, connected } = useStomp();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    // Variables to store drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    stompClient?.subscribe("/topic/drawing", (message) => {
      // const {x,y} = JSON.parse(;
      console.log(JSON.parse(message.body));
      const {x,y} = JSON.parse(message.body);
     if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }

      [lastX, lastY] = [e.offsetX, e.offsetY];
      
    });
    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      isDrawing = true;
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          x: e.offsetX,
          y: e.offsetY,
          tool: "pencil",
          color: "black",
          size: 1,
        }),
      });
      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    // Function to draw
    const draw = (e: { offsetX: number; offsetY: number }) => {
     if (!isDrawing) return;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }

      [lastX, lastY] = [e.offsetX, e.offsetY];
    };

    // Function to end drawing
    const endDrawing = () => {
      isDrawing = false;
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
