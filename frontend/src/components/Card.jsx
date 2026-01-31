import React from "react";

/* =========================================================
   CARD PRIMITIVE (DESIGN SYSTEM CORE)
   - glass + depth ready
   - tilt compatible
   - zero logic coupling
========================================================= */

const Card = ({
  children,
  className = "",
  as: Component = "div",
}) => {
  return (
    <Component
      className={`
        card
        glass
        relative
        transition-all
        duration-300
        transform-gpu
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Card;
