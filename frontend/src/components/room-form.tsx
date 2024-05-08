import React from "react";

import { useForm, SubmitHandler } from "react-hook-form";
import { roomType } from "../zod/room";
export default function RoomForm({ page }: { page: string }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<roomType>();
  console.log(watch("name"));
  const onSubmit: SubmitHandler<roomType> = (data) => {
    console.log(data);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col border-2 bolder-solid border-gray-300 p-8 space-y-4 text-lg rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    >
      <input
        type="text"
        placeholder="Room Name"
        {...register("name")}
        name="room"
        className="border-2 border-gray-300 p-2"
      />
      {errors.name && <span>This field is required</span>}
      <button
        type="submit"
        className=" bg-blue-800 text-white hover:bg-blue-500 rounded-lg w-1/2 mx-auto p-2"
      >
        {page==='create'?'Create Room':'Join Room'}
      </button>
    </form>
  );
}
