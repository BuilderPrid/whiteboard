import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import JoinRoom from "./pages/join-room-page.tsx";
import CreateRoom from "./pages/create-room-page.tsx";
import ProtectedRoute from "./components/protected-route.tsx";
import RoomPage from "./pages/roomPage.tsx";
import StompProvider from "./contexts/stomp-context.tsx";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create",
    element: (
      <ProtectedRoute>
        <CreateRoom />
      </ProtectedRoute>
    ),
  },
  {
    path: "room/:id",
    element: (
      <ProtectedRoute>
        <RoomPage />
      </ProtectedRoute>
    ),
  },
  {
    path:"/join",
    element: (
      <ProtectedRoute>
        <JoinRoom />
      </ProtectedRoute>
    )
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Navbar />
      <StompProvider>
        <RouterProvider router={routes} />
      </StompProvider>
    </ClerkProvider>
  </React.StrictMode>
);
