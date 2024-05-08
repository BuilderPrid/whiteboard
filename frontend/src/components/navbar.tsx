import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
  UserProfile,
} from "@clerk/clerk-react";
import React from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between bg-gray-500 p-4 text-4xl">
      <ul className="bg-gray-500 flex items-center space-x-4 text-xl ">
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
      <div className="">
        <SignedOut>
          <button className="bg-red-300 rounded-lg p-2">
            <SignInButton />
          </button>
        </SignedOut>
        <SignedIn>
          <p className="mr-10 ">
            <UserButton/>
          </p>
        </SignedIn>
      </div>
    </nav>
  );
}
