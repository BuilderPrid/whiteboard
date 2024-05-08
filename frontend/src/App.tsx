import { Link } from "react-router-dom";

export default function App() {
  return (
    <>
      <div className="flex flex-col space-y-10 h-[80vh] items-center justify-center text-2xl">
        <div className="space-x-8">
          <button className="bg-red-400 rounded-lg p-3 w-[110px]">
            <Link to={'/create'}>
            Create
</Link>
          </button>
          <button className="bg-blue-400 rounded-lg p-3 w-[110px]">Join</button>
        </div>
        <button className="bg-green-400 rounded-lg p-3 w-[110px]">Try</button>
      </div>
    </>
  );
}
8;
