import React, { useState } from "react";
import { PostData } from "../context/PostContext";
import { LoadingAnimation } from "./Loading";

const AddPost = ({ type }) => {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [filePrev, setFilePrev] = useState(null);

  const { addPost, addLoading } = PostData();

  /* ---------- File Preview ---------- */
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
    formdata.append("caption", caption);
    formdata.append("file", file);

    // ✅ Correct argument order
    addPost(
      formdata,
      setFile,
      setFilePrev,
      setCaption,
      type
    );
  };

  return (
    <div className="bg-gray-100 flex justify-center pt-3 pb-5">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            className="custom-input"
            placeholder="Enter caption"
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

          {filePrev &&
            (type === "post" ? (
              <img src={filePrev} alt="preview" />
            ) : (
              <video
                src={filePrev}
                controls
                controlsList="nodownload"
                className="h-[450px] w-[300px]"
              />
            ))}

          <button
            disabled={addLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {addLoading ? <LoadingAnimation /> : "+ Add Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
