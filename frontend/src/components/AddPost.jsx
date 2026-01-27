import React, { useState } from "react";
import { PostData } from "../context/PostContext";
import { UserData } from "../context/UserContext";
import { LoadingAnimation } from "./Loading";
import toast from "react-hot-toast";

const AddPost = ({ type }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState("");
  const [filePrev, setFilePrev] = useState("");

  const { addPost, addLoading } = PostData();
  const { isAuth, loading: authLoading } = UserData(); // 🔴 IMPORTANT

  const changeFileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onloadend = () => {
      setFilePrev(reader.result);
      setFile(selectedFile);
    };
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // 🔴 FINAL GUARD (UI level)
    if (authLoading) {
      toast.error("Checking login status...");
      return;
    }

    if (!isAuth) {
      toast.error("Please login first");
      return;
    }

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    const formdata = new FormData();
    formdata.append("caption", caption);
    formdata.append("file", file);

    // ✅ CORRECT argument order
    addPost(formdata, setFile, setFilePrev, setCaption, type);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-5">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4 items-center justify-between mb-4"
        >
          <input
            type="text"
            className="custom-input"
            placeholder="Enter Caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <input
            type="file"
            className="custom-input"
            accept={type === "post" ? "image/*" : "video/*"}
            onChange={changeFileHandler}
            required
          />

          {filePrev && (
            <>
              {type === "post" ? (
                <img src={filePrev} alt="preview" />
              ) : (
                <video
                  controls
                  controlsList="nodownload"
                  src={filePrev}
                  className="h-[450px] w-[300px]"
                />
              )}
            </>
          )}

          <button
            type="submit"
            disabled={addLoading || authLoading || !isAuth} // 🔴 KEY FIX
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {addLoading ? <LoadingAnimation /> : "+ Add Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
