import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [file, setFile] = useState(null);
  const [filePrev, setFilePrev] = useState(null);

  const { registerUser, loading } = UserData();
  const { fetchPosts } = PostData();
  const navigate = useNavigate();

  /* ---------- File Handler ---------- */
  const changeFileHandler = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(selectedFile);
    };
  };

  /* ---------- Submit ---------- */
  const submitHandler = (e) => {
    e.preventDefault();
    if (!file) return;

    const formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("gender", gender);
    formdata.append("file", file);

    registerUser(formdata, navigate, fetchPosts);
  };

  if (loading) return <Loading />;

  return (
    <div className="flex justify-center">
      <div className="flex flex-col md:flex-row shadow-md rounded-xl max-w-7xl w-[90%] md:w-[50%] md:mt-[40px]">
        {/* Left */}
        <div className="w-full md:w-3/4">
          <div className="flex flex-col items-center py-6">
            <h1 className="font-semibold text-xl md:text-3xl text-gray-600">
              Register to Social Media
            </h1>
          </div>

          <form onSubmit={submitHandler}>
            <div className="flex flex-col items-center space-y-6">
              {filePrev && (
                <img
                  src={filePrev}
                  className="w-[180px] h-[180px] rounded-full"
                  alt="Preview"
                />
              )}

              <input
                type="file"
                className="custom-input"
                accept="image/*"
                onChange={changeFileHandler}
                required
              />

              <input
                type="text"
                className="custom-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

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

              <select
                className="custom-input"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="text-center mt-7">
              <button type="submit" className="auth-btn">
                Register
              </button>
            </div>
          </form>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 flex items-center justify-center">
          <div className="text-white text-center my-10 space-y-3 px-4">
            <h1 className="text-4xl font-bold">Already registered?</h1>
            <p>Login to your account</p>
            <Link
              to="/login"
              className="bg-white rounded-2xl px-4 py-1 text-emerald-500 font-semibold"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
