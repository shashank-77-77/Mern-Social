import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import { UserContextProvider } from "./context/UserContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <UserContextProvider>
        <PostContextProvider>
          <ChatContextProvider>
            <SocketContextProvider>
              <App />
            </SocketContextProvider>
          </ChatContextProvider>
        </PostContextProvider>
      </UserContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
