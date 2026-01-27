import { useState, useEffect } from "react";
import api from "../utils/axios";
import { UserData } from "../context/UserContext";
import toast from "react-hot-toast";

const Search = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAuth, loading: authLoading } = UserData();

  const searchUsers = async () => {
    if (authLoading) return;

    if (!isAuth) {
      toast.error("Please login to search users");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.get(
        `/user/all?search=${search}`
      );
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 optional: auto-search when typing
  useEffect(() => {
    if (search.trim() && isAuth && !authLoading) {
      searchUsers();
    }
  }, [search, isAuth, authLoading]);

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button
          onClick={searchUsers}
          disabled={loading || authLoading || !isAuth}
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {!loading && users.length === 0 && search && (
        <p>No User please Search</p>
      )}

      <div className="w-full max-w-md">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-2 border-b"
          >
            <img
              src={user.profilePic?.url}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
