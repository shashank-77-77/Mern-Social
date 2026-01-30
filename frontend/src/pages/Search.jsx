import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaUserFriends } from "react-icons/fa";
import { FaBolt, FaPaperPlane } from "react-icons/fa6";
import api from "../utils/axios";
import { UserData } from "../context/UserContext";
import toast from "react-hot-toast";

/* =========================================================
   SEARCH (USER DISCOVERY)
   ========================================================= */
const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuth, loading: authLoading } = UserData();

  /* ===============================
     DERIVED STATE
     =============================== */
  const canSearch = useMemo(
    () => isAuth && !authLoading && query.trim().length > 0,
    [isAuth, authLoading, query]
  );

  /* ===============================
     PARALLAX BACKGROUND
     =============================== */
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty(
        "--x",
        `${(e.clientX - window.innerWidth / 2) / 90}px`
      );
      document.documentElement.style.setProperty(
        "--y",
        `${(e.clientY - window.innerHeight / 2) / 90}px`
      );
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  /* ===============================
     SEARCH HANDLER
     =============================== */
  const searchUsers = async () => {
    if (authLoading) return;

    if (!isAuth) {
      toast.error("Please login to search users");
      return;
    }

    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(
        `/user/all?search=${encodeURIComponent(query)}`
      );
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search failed", error);
      toast.error("Search failed. Please try again.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     AUTO SEARCH (DEBOUNCED)
     =============================== */
  useEffect(() => {
    if (!canSearch) {
      setUsers([]);
      return;
    }

    const t = setTimeout(searchUsers, 350);
    return () => clearTimeout(t);
  }, [query, canSearch]); // eslint-disable-line

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="relative min-h-screen overflow-hidden pb-24">
      {/* Animated gradient background */}
      <div className="parallax" />

      {/* Floating icons */}
      <div className="floating-icons">
        <FaUserFriends
          className="floating-icon text-blue-400 text-4xl"
          style={{ left: "20%" }}
        />
        <FaPaperPlane
          className="floating-icon text-cyan-400 text-4xl"
          style={{ left: "50%", animationDelay: "7s" }}
        />
        <FaBolt
          className="floating-icon text-purple-400 text-4xl"
          style={{ left: "75%", animationDelay: "12s" }}
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-3 sm:px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="text-center mt-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Discover People
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Find friends, creators, and people you may know
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="glass p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="
                    w-full
                    pl-11 pr-4 py-3
                    rounded-xl
                    bg-white/70
                    backdrop-blur
                    border border-white/40
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-400
                    transition
                  "
                />
              </div>

              <button
                onClick={searchUsers}
                disabled={!canSearch || loading}
                className="
                  btn-primary
                  w-full sm:w-auto
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </div>
          </div>

          {/* RESULTS */}
          <div className="glass p-2 sm:p-3">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-400">
                Searching users…
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-2">
                {users.map((u) => (
                  <div
                    key={u._id}
                    className="
                      flex items-center gap-4
                      px-4 py-3
                      rounded-xl
                      hover:bg-white/20
                      transition
                      cursor-pointer
                    "
                  >
                    <img
                      src={u.profilePic?.url}
                      alt={u.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-300"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        View profile
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : query ? (
              <div className="p-8 text-center text-sm text-gray-400">
                No users found
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-gray-400">
                Start typing to search users
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
