import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

/* ---------- Axios Instance ---------- */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/* ---------- Provider ---------- */
export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------- Register ---------- */
  const registerUser = async (formdata, navigate, fetchPosts) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", formdata);

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      fetchPosts?.();
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Login ---------- */
  const loginUser = async (email, password, navigate, fetchPosts) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      fetchPosts?.();
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Fetch Logged-in User ---------- */
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/user/me");
      setUser(data);
      setIsAuth(true);
    } catch {
      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Logout ---------- */
  const logoutUser = async (navigate) => {
    try {
      const { data } = await api.post("/api/auth/logout");
      toast.success(data.message);
      setUser(null);
      setIsAuth(false);
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  /* ---------- Follow / Unfollow ---------- */
  const followUser = async (id, refreshProfile) => {
    try {
      const { data } = await api.post(`/api/user/follow/${id}`);
      toast.success(data.message);
      refreshProfile?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  /* ---------- Update Profile ---------- */
  const updateProfilePic = async (id, formdata, setFile) => {
    try {
      const { data } = await api.put(`/api/user/${id}`, formdata);
      toast.success(data.message);
      fetchUser();
      setFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  const updateProfileName = async (id, name, setShowInput) => {
    try {
      const { data } = await api.put(`/api/user/${id}`, { name });
      toast.success(data.message);
      fetchUser();
      setShowInput(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  /* ---------- Init ---------- */
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        registerUser,
        loginUser,
        logoutUser,
        followUser,
        updateProfilePic,
        updateProfileName,
        fetchUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

/* ---------- Hook ---------- */
export const UserData = () => useContext(UserContext);
