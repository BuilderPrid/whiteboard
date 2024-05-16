import React, { MutableRefObject } from 'react'
import { useUser } from "@clerk/clerk-react";
import { useStomp } from "../contexts/stomp-context";
import { RoughCanvas } from 'roughjs/bin/canvas';
import { WhiteboardElementType } from '../zod/whiteboard-elements';

export default function useRectangle({canvasRef,myTool,myColor,roughRef,setElements,elements}: {elements:WhiteboardElementType[],setElements:React.Dispatch<React.SetStateAction<WhiteboardElementType[]>> ,canvasRef:React.RefObject<HTMLCanvasElement|null>,roughRef: MutableRefObject<RoughCanvas|undefined>,myTool:string,myColor:string}) {
    let myIsDrawing = false;
    let myStartX = canvasRef?.current?.getBoundingClientRect().top || 0;
    let myStartY = canvasRef?.current?.getBoundingClientRect().left || 0;
    const { user } = useUser();
    const { stompClient } = useStomp();
const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      myIsDrawing = true;
      myStartX = e.offsetX - myStartX;
      myStartY = e.offsetY - myStartY;
      setElements((prev:WhiteboardElementType[]) => [...prev, {tool:'rectangle', offsetX:myStartX, offsetY:myStartY, stroke:myColor, strokeWidth:1}]);
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          type: "start",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          isDrawing: true,
          startX: e.offsetX,
          startY: e.offsetY,
          userTool: myTool,
          userColor: myColor,
          userToolSize: 1,
        }),
      });
    };

    // // Function to draw
    const draw = (e: { offsetX: number; offsetY: number }) => {
      if (!myIsDrawing) return;
      console.log("drawing",canvasRef);
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          type: "draw",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          isDrawing: true,
          x: e.offsetX,
          y: e.offsetY,
          userTool: myTool,
          userColor: myColor,
          userToolSize: 1,
        }),
      });
      if(!roughRef.current) return;
      const {offsetX,offsetY} = e;
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === prevElements.length - 1
            ? {
                ...ele,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
              }
            : ele
        ));
    };

    // // Function to end drawing
    const endDrawing = () => {
      myIsDrawing = false;
      myStartX = 0;
      myStartY = 0;
      stompClient?.publish({
        destination: "/app/draw",
        body: JSON.stringify({
          type: "end",
          userEmail: user?.primaryEmailAddress?.emailAddress,
          isDrawing: false,
          userTool: myTool,
          userColor: myColor,
          userToolSize: 1,
          size: 1,
        }),
      });
      console.log(elements,user?.primaryEmailAddress?.emailAddress,'ee');
// stompClient?.publish({
//       destination: `/app/elements/`,
//       body: JSON.stringify({
//         email: user?.primaryEmailAddress?.emailAddress,
//         elements,
//       }),
//     });
    };
    const setRectangleListeners = () => {
      console.log("setting listeners");
    canvasRef?.current?.addEventListener("mousedown", startDrawing);
    canvasRef?.current?.addEventListener("mousemove", draw);
    canvasRef?.current?.addEventListener("mouseup", endDrawing);
    canvasRef?.current?.addEventListener("mouseout", endDrawing);
    }
    const removeRectangleListeners = () => {
    canvasRef?.current?.removeEventListener("mousedown", startDrawing);
    canvasRef?.current?.removeEventListener("mousemove", draw);
    canvasRef?.current?.removeEventListener("mouseup", endDrawing);
    canvasRef?.current?.removeEventListener("mouseout", endDrawing);
    }
 
  return {startDrawing, draw, endDrawing, myIsDrawing, myColor, myTool, setRectangleListeners,removeRectangleListeners}
}
