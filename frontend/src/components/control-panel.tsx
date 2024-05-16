import React from "react";
import { FaEraser } from "react-icons/fa";
export default function ControlPanel({
  setMyTool,
  setMyColor,
}: {
  setMyTool: React.Dispatch<React.SetStateAction<string>>;
  setMyColor: React.Dispatch<React.SetStateAction<string>>;
}) {
  const colorArray: { [key: string]: string } = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    white: "bg-white",
    black: "bg-black",
    cyan: "bg-cyan-500",
  };
  const keys = Object.keys(colorArray);
  const colorBox = keys.map((color: string) => {
    return (
      <button
        className={`w-10 h-10 ${colorArray[color]} border-4 border-solid border-cyan-400`}
        onClick={() => {setMyTool('pencil');setMyColor(color)}}

      ></button>
    );
  });
const eraser = <button className='w-10 h-10 bg-cyan-400 items-center justify-center flex p-2' onClick={()=>{setMyTool('rectangle')}}><FaEraser/></button>

        return <div className="flex items-center justify-center">{colorBox}{eraser}</div>;
}
