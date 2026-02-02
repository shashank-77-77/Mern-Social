import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PostData } from "../context/PostContext";

/* =========================================================
   ADD POST — ADVANCED UX LAYER (SAFE & EXTENSIBLE)
   FEATURES:
   ✔ Drag & Drop Media
   ✔ Upload Progress Bar
   ✔ AI Caption Preview
   ✔ AI Hashtag Generator
   ✔ Sound + Haptic Feedback
   ✔ ZERO breaking changes
========================================================= */

const AddPost = ({ type }) => {
  const { fetchPosts } = PostData();

  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  /* ===============================
     CORE STATE
     =============================== */
  const [caption, setCaption] = useState("");
  const [aiPreview, setAiPreview] = useState("");
  const [hashtags, setHashtags] = useState([]);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [useAI, setUseAI] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [hashLoading, setHashLoading] = useState(false);

  /* ===============================
     SOUND + HAPTIC (SAFE)
     =============================== */
  useEffect(() => {
    audioRef.current = new Audio("/send.mp3"); // optional asset
  }, []);

  const feedback = () => {
    navigator.vibrate?.(20);
    audioRef.current?.play().catch(() => {});
  };

  /* ===============================
     FILE HANDLING
     =============================== */
  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    feedback();
  };

  const fileChangeHandler = (e) =>
    handleFile(e.target.files[0]);

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  /* ===============================
     AI: IMPROVE CAPTION
     =============================== */
  const generateAiPreview = async () => {
    if (!caption.trim()) {
      toast.error("Write a caption first");
      return;
    }

    try {
      setAiLoading(true);
      const { data } = await axios.post("/api/ai/improve", {
        text: caption,
        context: "post",
      });

      if (data?.text) setAiPreview(data.text);
    } catch {
      toast.error("AI caption failed");
    } finally {
      setAiLoading(false);
    }
  };

  /* ===============================
     AI: HASHTAG GENERATOR
     =============================== */
  const generateHashtags = async () => {
    const baseText = aiPreview || caption;
    if (!baseText.trim()) {
      toast.error("Write a caption first");
      return;
    }

    try {
      setHashLoading(true);
      const { data } = await axios.post("/api/ai/hashtags", {
        text: baseText,
        context: type,
      });

      if (Array.isArray(data)) {
        setHashtags(data.slice(0, 8));
      }
    } catch {
      toast.error("Hashtag generation failed");
    } finally {
      setHashLoading(false);
    }
  };

  const applyHashtags = () => {
    if (!hashtags.length) return;
    setCaption(
      caption + " " + hashtags.map((h) => `#${h}`).join(" ")
    );
    setHashtags([]);
  };

  /* ===============================
     SUBMIT (BACKEND CONTRACT SAFE)
     =============================== */
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Select media first");

    const formData = new FormData();
    formData.append("caption", aiPreview || caption);
    formData.append("file", file);
    formData.append("useAI", useAI);
    formData.append("type", type);

    try {
      setIsUploading(true);
      setProgress(0);

      await axios.post(`/api/post/new?type=${type}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) =>
          setProgress(
            Math.round((e.loaded * 100) / e.total)
          ),
      });

      toast.success("Post published");
      feedback();

      setCaption("");
      setAiPreview("");
      setHashtags([]);
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
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`
          glass card
          w-full max-w-md p-5 space-y-4
          transition-all
          ${dragActive ? "ring-2 ring-cyan-400 scale-[1.02]" : ""}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            Create {type === "reel" ? "Reel" : "Post"}
          </h3>
          {useAI && <span className="ai-badge">✨ AI</span>}
        </div>

        {/* Caption */}
        <input
          className="custom-input"
          placeholder="Write something…"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* AI Preview */}
        {aiPreview && (
          <div className="glass p-3 text-sm text-gray-600">
            <strong>AI Preview:</strong> {aiPreview}
          </div>
        )}

        {/* AI Hashtags */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              onClick={generateHashtags}
              disabled={hashLoading}
              className="text-purple-500 hover:text-purple-600"
            >
              {hashLoading ? "Generating…" : "✨ Generate hashtags"}
            </button>

            {hashtags.length > 0 && (
              <button
                type="button"
                onClick={applyHashtags}
                className="text-blue-500"
              >
                Apply
              </button>
            )}
          </div>

          {hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs">
              {hashtags.map((h, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full bg-purple-50 text-purple-600"
                >
                  #{h}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Media Preview */}
        {preview && (
          <div className="rounded-xl overflow-hidden border">
            {type === "post" ? (
              <img src={preview} className="w-full object-cover" />
            ) : (
              <video src={preview} controls className="w-full" />
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useAI}
              onChange={(e) => {
                setUseAI(e.target.checked);
                e.target.checked && generateAiPreview();
              }}
            />
            AI Enhance
          </label>

          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-blue-500"
          >
            Upload Media
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={fileChangeHandler}
          />
        </div>

        {/* Progress */}
        {isUploading && (
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-500 rounded transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Submit */}
        <button
          disabled={isUploading}
          className="btn-primary w-full"
        >
          {isUploading
            ? `Uploading ${progress}%`
            : "+ Publish"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
