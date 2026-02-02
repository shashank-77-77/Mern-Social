import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import UserAccount from "./pages/UserAccount";
import Reels from "./pages/Reels";
import Search from "./pages/Search";
import ChatPage from "./pages/ChatPage";
import Developer from "./pages/Developer"; // ✅ NEW (isolated addition)

import NavigationBar from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import { Loading } from "./components/Loading";

import { UserData } from "./context/UserContext";

// ✅ 3D / background layer (non-blocking, no routing impact)
import SceneBackground from "./ui/SceneBackground";

const App = () => {
  const { loading, isAuth, user } = UserData();

  // 🔒 Global loading gate (unchanged)
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* 🔹 Global visual layer (independent of routing/auth) */}
      <SceneBackground />

      {/* 🔹 Application routing layer */}
      <BrowserRouter>
        <Routes>
          {/* Core routes */}
          <Route path="/" element={isAuth ? <Home /> : <Login />} />
          <Route path="/reels" element={isAuth ? <Reels /> : <Login />} />

          {/* Account routes */}
          <Route
            path="/account"
            element={isAuth ? <Account user={user} /> : <Login />}
          />

          <Route
            path="/user/:id"
            element={isAuth ? <UserAccount user={user} /> : <Login />}
          />

          {/* Auth routes */}
          <Route path="/login" element={!isAuth ? <Login /> : <Home />} />
          <Route
            path="/register"
            element={!isAuth ? <Register /> : <Home />}
          />

          {/* Feature routes */}
          <Route path="/search" element={isAuth ? <Search /> : <Login />} />
          <Route
            path="/chat"
            element={isAuth ? <ChatPage user={user} /> : <Login />}
          />

          {/* ✅ Developer route (explicitly non-auth-gated) */}
          <Route path="/developer" element={<Developer />} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* 🔹 Persistent navigation (auth-gated, unchanged) */}
        {isAuth && <NavigationBar />}
      </BrowserRouter>
    </>
  );
};

export default App;
