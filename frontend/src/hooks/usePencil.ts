import React, { MutableRefObject } from 'react'
import { useUser } from "@clerk/clerk-react";
import { useStomp } from "../contexts/stomp-context";
import { RoughCanvas } from 'roughjs/bin/canvas';
import { WhiteboardElementType } from '../zod/whiteboard-elements';
export default function usePencil({canvasRef,myColor,myTool,roughRef,setElements}: {setElements:React.Dispatch<React.SetStateAction<WhiteboardElementType[]>>,roughRef:MutableRefObject<RoughCanvas|undefined>,canvasRef: React.RefObject<HTMLCanvasElement>|null,myColor:string,myTool:string}) {
    let myIsDrawing = false;
    let myLastX = 0;
    let myLastY = 0;
    // console.log(canvasRef.current)
    // const [rc,setRc] = useState(null);
    // let myColor = "black";
    // let myTool = "pencil";
    // let mySize = 1;
    // React.useEffect(() => {
    //     // const canvasRef = canvasRef?.current;
    //     if (canvasRef) {
    //       const ctx = canvasRef.current?.getContext("2d");
    //       // setRc(rough.canvas(canvasRef.current));
    //       if (ctx) {
    //         ctx.strokeStyle = "black";
    //         ctx.lineWidth = 1;
    //         console.log("ctx",ctx);
    //       }
    //     }
    //     console.log("canvasRefRef",canvasRef)
    //   }, [canvasRef]);

    // const [myColor, setMyColor] = React.useState("black");
    // const [myTool, setMyTool] = React.useState("pencil");
    const [mySize, setMySize] = React.useState(1);

    const { user } = useUser();
    const { stompClient } = useStomp();
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
          userTool: "pencil",
          userColor: myColor,
          userToolSize: 1,
        }),
      });
      setElements((prev) => [...prev, {tool:'pencil', offsetX:e.offsetX, offsetY:e.offsetY,path:[[e.offsetX,e.offsetY]], stroke:myColor, strokeWidth:1}]);
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
      console.log("drawing",canvasRef);
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
      
    //   const canvasRef = canvasRefRef.current;
      // const ctx = canvasRef?.current?.getContext("2d");
      // if (ctx) {
      //   ctx.beginPath();
      //   ctx.moveTo(myLastX, myLastY);
      //   ctx.lineTo(e.offsetX, e.offsetY);
      //   ctx.stroke();
      // }
      if(!roughRef.current) return;
      // roughRef.current.line(myLastX, myLastY, e.offsetX, e.offsetY, { stroke: myColor, strokeWidth: 1 });
      const {offsetX,offsetY} = e;
      setElements((prev) =>
        prev.map((ele, index) =>
          index === prev.length - 1
            ? {
                ...ele,
               path:ele.path && [...ele.path, [offsetX, offsetY]]
              }
            : ele
        ));
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
    const setPencilListeners = () => {
    canvasRef?.current?.addEventListener("mousedown", startDrawing);
    canvasRef?.current?.addEventListener("mousemove", draw);
    canvasRef?.current?.addEventListener("mouseup", endDrawing);
    canvasRef?.current?.addEventListener("mouseout", endDrawing);
    }
    const removePencilListeners = () => {
    canvasRef?.current?.removeEventListener("mousedown", startDrawing);
    canvasRef?.current?.removeEventListener("mousemove", draw);
    canvasRef?.current?.removeEventListener("mouseup", endDrawing);
    canvasRef?.current?.removeEventListener("mouseout", endDrawing);
    }
 
  return {startDrawing, draw, endDrawing, myIsDrawing, myLastX, myLastY, myColor, myTool, mySize, setMySize,setPencilListeners,removePencilListeners}
}
