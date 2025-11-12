// import React from "react";
// import "./LoadingScreen.css";

// const LoadingScreen = ({ fullscreen = true }) => {
//   return (
//     <div className={`loading-overlay ${fullscreen ? "fullscreen" : "inline"}`}>
//       <div className="dots-loader">
//         <span></span>
//         <span></span>
//         <span></span>
//         <span></span>
//       </div>
//       <h2 className="loading-text">Loading...</h2>
//     </div>
//   );
// };

// export default LoadingScreen;











import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({ fullscreen = true, numDots = 5 }) => {
  // generate an array [0, 1, 2, ..., numDots-1] for mapping dots
  const dots = Array.from({ length: numDots });

  return (
    <div className={`loading-overlay ${fullscreen ? "fullscreen" : "inline"}`}>
      <div className="dots-loader">
        {dots.map((_, i) => (
          <span key={i} style={{ '--i': i, '--total': numDots }}></span>
        ))}
      </div>
      <h2 className="loading-text">Loading...</h2>
    </div>
  );
};

export default LoadingScreen;
