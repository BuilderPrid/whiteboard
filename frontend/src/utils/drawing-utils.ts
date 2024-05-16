import { MutableRefObject } from "react";
import { WhiteboardElementType } from "../zod/whiteboard-elements";
import { RoughCanvas } from "roughjs/bin/canvas";

export const drawFigures = (elements:WhiteboardElementType[],roughCanvasRef:MutableRefObject<RoughCanvas|undefined>) =>{
elements.map((ele) => {
      if (!roughCanvasRef.current) return;
      if (ele.tool === "rectangle") {
        console.log('rect',ele)
        roughCanvasRef.current.rectangle(
          ele.offsetX,
          ele.offsetY,
          ele.width!,
          ele.height!,
          { stroke: ele.stroke, strokeWidth: ele.strokeWidth }
        );
      } else if (ele.tool === "pencil") {
        if (!ele.path) return;
        roughCanvasRef.current.linearPath(ele.path as [], {
          stroke: ele.stroke,
          strokeWidth: ele.strokeWidth,
        });
      }
    });
}