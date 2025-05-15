import React, { useEffect, useRef } from "react";

// Custom marker SVGs as React components
const MapPin = ({ x, y, color }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="0" cy="0" r="10" fill={color} stroke="white" strokeWidth="2" />
    <path
      d="M 0 0 L -5 15 L 5 15 Z"
      fill={color}
      stroke="white"
      strokeWidth="1"
    />
  </g>
);

const AnimatedRoute = () => {
  const userRef = useRef(null);

  useEffect(() => {
    const user = userRef.current;
    const path = document.getElementById("routePath");

    const length = path.getTotalLength();
    let progress = 0;
    const speed = 2;

    const animate = () => {
      const point = path.getPointAtLength(progress);
      user.setAttribute("cx", point.x);
      user.setAttribute("cy", point.y);

      progress += speed;
      if (progress >= length) progress = 0;

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <svg viewBox="0 0 500 300" className="w-[90%] max-w-md h-auto">
        {/* Curved path with the start point slightly higher than the end */}
        <path
          id="routePath"
          d="M 50 200 
             C 125 80, 175 120, 250 200 
             S 375 280, 450 220"
          fill="none"
          stroke="#1e40af"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Start and End Markers */}
        <MapPin x={50} y={200} color="green" /> {/* Start */}
        <MapPin x={450} y={220} color="red" />  {/* End */}

        {/* User animated marker */}
        <circle ref={userRef} r="8" fill="blue" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default AnimatedRoute;
