import React, { useEffect, useRef } from "react";

const AnimatedRoute = () => {
  const userRef = useRef(null);

  useEffect(() => {
    const user = userRef.current;
    const path = document.getElementById("routePath");

    let length = path.getTotalLength();
    let start = 0;
    let speed = 2; // pixels per frame

    const animate = () => {
      const point = path.getPointAtLength(start);
      user.setAttribute("cx", point.x);
      user.setAttribute("cy", point.y);

      start += speed;
      if (start >= length) start = 0;

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto bg-white">
      {/* Route path with smooth curve */}
      <path
        id="routePath"
        d="M 50 250 Q 250 50 450 250"
        fill="none"
        stroke="#1e40af"
        strokeWidth="4"
      />

      {/* Source point */}
      <circle cx="50" cy="250" r="10" fill="green" />

      {/* Destination point */}
      <circle cx="450" cy="250" r="10" fill="red" />

      {/* User marker */}
      <circle ref={userRef} r="8" fill="blue" />
    </svg>
  );
};

export default AnimatedRoute;
