import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import UserAccount from "./pages/UserAccount";
import Reels from "./pages/Reels";
import Search from "./pages/Search";
import ChatPage from "./pages/ChatPage";
import Developer from "./pages/Developer";

import NavigationBar from "./components/NavigationBar";
import NotFound from "./components/NotFound";
import { Loading } from "./components/Loading";

import { UserData } from "./context/UserContext";
import SceneBackground from "./ui/SceneBackground";

const App = () => {
  const { loading, isAuth, user } = UserData();

  /* ======================================================
     GLOBAL LOADING GATE
     (prevents route flash & auth race conditions)
  ====================================================== */
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* ==================================================
          GLOBAL VISUAL LAYER
          (independent of routing & auth)
      ================================================== */}
      <SceneBackground />

      {/* ==================================================
          APPLICATION ROUTING LAYER
      ================================================== */}
      <BrowserRouter>
        <Routes>
          {/* ================= CORE ROUTES ================= */}
          <Route
            path="/"
            element={isAuth ? <Home /> : <Login />}
          />

          <Route
            path="/reels"
            element={isAuth ? <Reels /> : <Login />}
          />

          {/* ================= ACCOUNT ROUTES =============== */}
          <Route
            path="/account"
            element={isAuth ? <Account user={user} /> : <Login />}
          />

          <Route
            path="/user/:id"
            element={isAuth ? <UserAccount user={user} /> : <Login />}
          />

          {/* ================= AUTH ROUTES ================== */}
          <Route
            path="/login"
            element={!isAuth ? <Login /> : <Navigate to="/" replace />}
          />

          <Route
            path="/register"
            element={!isAuth ? <Register /> : <Navigate to="/" replace />}
          />

          {/* ================= FEATURE ROUTES =============== */}
          <Route
            path="/search"
            element={isAuth ? <Search /> : <Login />}
          />

          <Route
            path="/chat"
            element={isAuth ? <ChatPage user={user} /> : <Login />}
          />

          {/* ================= DEVELOPER / PORTFOLIO ======== */}
          {/* Canonical route */}
          <Route path="/developer" element={<Developer />} />

          {/* SEO + UX alias */}
          <Route path="/portfolio" element={<Developer />} />

          {/* Legacy deep-link normalization */}
          <Route
            path="/portfolio/index.html"
            element={<Navigate to="/portfolio" replace />}
          />

          {/* ================= FALLBACK ===================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* ==================================================
            PERSISTENT NAVIGATION
            (auth-gated, rendered after routes)
        ================================================== */}
        {isAuth && <NavigationBar />}
      </BrowserRouter>
    </>
  );
};

export default App;
