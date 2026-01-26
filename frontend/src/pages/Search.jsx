import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingAnimation } from "../components/Loading";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    if (!search.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        "/api/user/all?search=" + search
      );
      setUsers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex flex-col items-center pt-5">
        {/* Search Bar */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            className="custom-input"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchUsers}
            className="px-3 py-2 bg-blue-500 text-white rounded-md"
          >
            Search
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 w-full flex flex-col items-center">
          {loading ? (
            <LoadingAnimation />
          ) : users.length > 0 ? (
            users.map((user) => (
              <Link
                key={user._id}
                to={`/user/${user._id}`}
                className="mt-3 px-4 py-2 bg-gray-300 rounded-md flex items-center gap-3 w-[250px]"
              >
                <img
                  src={user.profilePic?.url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </Link>
            ))
          ) : (
            search && (
              <p className="text-gray-500 mt-4">
                No users found
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
