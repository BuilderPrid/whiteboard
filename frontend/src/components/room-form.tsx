import { useForm, SubmitHandler } from "react-hook-form";
import { roomType } from "../zod/room";
import axios, { AxiosError } from "axios";
import { useUser } from "@clerk/clerk-react";
import { MdError } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useStomp } from "../contexts/stomp-context";
import {
  useUserConnection,
  UserConnectionState,
} from "../store/user-settings-store";
export default function RoomForm({ page }: { page: string }) {
  const { user } = useUser();
  const { stompClient } = useStomp();
  const navigator = useNavigate();
  const { setLastX, setLastY, setIsDrawing, setSize, setColor } =
    useUserConnection<UserConnectionState>((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<roomType>();
  const onSubmit: SubmitHandler<roomType> = async (data) => {
    console.log(data, "data");
    if (page === "create") {
      data = {
        ...data,
        host: user?.primaryEmailAddress?.emailAddress || "",
        createdAt: new Date(),
      };
      try {
        const res = await axios.post("http://localhost:8080/create-room", data);
        setLastX((prev: any) => ({ ...prev, [email]: 0 }));
        setLastY((prev: any) => ({ ...prev, [email]: 0 }));
        setIsDrawing((prev: any) => ({ ...prev, [email]: false }));
        setColor((prev: any) => ({ ...prev, [email]: "black" }));
        setSize((prev: any) => ({ ...prev, [email]: 1 }));

        navigator(`/room/${res.data.id}`);
      } catch (e) {
        const { response: res } = e as AxiosError;
        if (res?.status === 409) {
          console.log(res, "res");
          setError("name", {
            type: "custom",
            message: "Room name in use",
          });
        } else {
          setError("name", {
            message: "Try again later",
          });
        }
      }
    } else {
      try {
        const res = await axios.post("http://localhost:8080/join-room", data);
        stompClient?.publish({
          destination: "/app/room",
          body: JSON.stringify({
            type: "join",
            roomId: res.data.id,
            user: user?.primaryEmailAddress?.emailAddress,
          }),
        });
        setLastX((prev: any) => ({ ...prev, [email]: 0 }));
        setLastY((prev: any) => ({ ...prev, [email]: 0 }));
        setIsDrawing((prev: any) => ({ ...prev, [email]: false }));
        setColor((prev: any) => ({ ...prev, [email]: "black" }));
        setSize((prev: any) => ({ ...prev, [email]: 1 }));
        navigator(`/room/${res.data.id}`);
      } catch (e) {
        const { response: res } = e as AxiosError;
        if (res?.status === 404) {
          setError("name", {
            type: "custom",
            message: "Room not found",
          });
        } else {
          setError("name", {
            message: "Try again later",
          });
        }
      }
    }
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
        name="name"
        className="border-2 border-gray-300 p-2"
      />
      {errors.name && (
        <span className="text-lg flex justify-center items-center gap-1 text-red-800 font-bold ">
          <MdError />
          {errors.name.message}
        </span>
      )}
      <button
        type="submit"
        className=" bg-blue-800 text-white hover:bg-blue-500 rounded-lg w-1/2 mx-auto p-2"
      >
        {page === "create" ? "Create Room" : "Join Room"}
      </button>
    </form>
  );
}
