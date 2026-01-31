import React, { useEffect } from "react";

/* =========================================================
   SIMPLE MODAL (GLASS + 3D SAFE)
========================================================= */
const SimpleModal = ({ isOpen, onClose, children }) => {
  /* ===============================
     ESC KEY HANDLER
     =============================== */
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative
          glass card
          w-[320px]
          p-4
          transform-gpu
          animate-[modalPop_0.25s_ease-out]
        "
      >
        {/* Close */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              text-gray-400
              hover:text-gray-600
              text-xl
              leading-none
              transition
            "
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 mt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;
