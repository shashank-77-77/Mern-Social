import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { loginUser, loading } = UserData();
  const { fetchPosts } = PostData();

  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate, fetchPosts);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center md:flex-row shadow-md rounded-xl max-w-7xl w-[90%] md:w-[50%] md:mt-[140px]">
        {/* Left */}
        <div className="w-full md:w-3/4">
          <div className="flex flex-col items-center py-6">
            <h1 className="font-semibold text-xl md:text-3xl text-gray-600">
              Login to Social Media
            </h1>
          </div>

          <form onSubmit={submitHandler}>
            <div className="flex flex-col items-center space-y-6">
              <input
                type="email"
                className="custom-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                className="custom-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-center mt-7">
              <button type="submit" className="auth-btn">
                Login
              </button>
            </div>
          </form>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 flex items-center justify-center">
          <div className="text-white text-center my-10 space-y-3 px-4">
            <h1 className="text-4xl font-bold">New here?</h1>
            <p>Create an account to get started</p>
            <Link
              to="/register"
              className="bg-white rounded-2xl px-4 py-1 text-emerald-500 font-semibold"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
