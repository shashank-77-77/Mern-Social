import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PostData } from "../context/PostContext";

/* =========================================================
   ADD POST — GLASS / DEPTH SAFE
========================================================= */
const AddPost = ({ type }) => {
  const { fetchPosts } = PostData();

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [useAI, setUseAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  /* ===============================
     FILE HANDLER
     =============================== */
  const fileChangeHandler = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /* ===============================
     SUBMIT HANDLER (UNCHANGED)
     =============================== */
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select an image or video");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file);
    formData.append("useAI", useAI);
    formData.append("type", type);

    try {
      setIsUploading(true);

      await axios.post(`/api/post/new?type=${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Post uploaded");

      setCaption("");
      setFile(null);
      setPreview(null);
      setUseAI(false);

      fetchPosts();
    } catch {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="flex justify-center">
      <form
        onSubmit={submitHandler}
        className="
          glass card
          w-full max-w-md
          p-5
          flex flex-col gap-4
          transition-transform
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">
            Create {type === "reel" ? "Reel" : "Post"}
          </h3>

          {useAI && (
            <span className="ai-badge text-xs px-2 py-1">
              ✨ AI ON
            </span>
          )}
        </div>

        {/* Caption */}
        <input
          type="text"
          placeholder="Write something…"
          className="custom-input"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Preview */}
        {preview && (
          <div className="rounded-xl overflow-hidden border">
            {type === "post" ? (
              <img
                src={preview}
                alt="preview"
                className="w-full max-h-[360px] object-cover"
              />
            ) : (
              <video
                src={preview}
                controls
                className="w-full max-h-[360px] object-cover"
              />
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
            />
            Enhance caption with AI
          </label>

          <input
            type="file"
            accept="image/*,video/*"
            onChange={fileChangeHandler}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isUploading}
          className="
            btn-primary
            mt-2
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {isUploading ? "Uploading…" : "+ Add Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
