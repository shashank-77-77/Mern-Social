import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import App from "./App.jsx";
import "./index.css";

import { UserContextProvider } from "./context/UserContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import { SocketContextProvider } from "./context/SocketContext.jsx";

/* ======================================================
   Global Axios Configuration (MUST run before contexts)
   ====================================================== */
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

/* ======================================================
   App Bootstrap
   ====================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      {/* Socket depends on authenticated user */}
      <SocketContextProvider>
        <PostContextProvider>
          <ChatContextProvider>
            <App />
          </ChatContextProvider>
        </PostContextProvider>
      </SocketContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
