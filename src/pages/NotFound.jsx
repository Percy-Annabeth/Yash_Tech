// import React from "react";
// import { Container, Typography, Button, Box } from "@mui/material";
// import { Link } from "react-router-dom";

// const NotFound = () => {
//   return (
//     <Box
//       sx={{
//         minHeight: "80vh",
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         textAlign: "center",
//         background: "linear-gradient(135deg, #1a237e, #3949ab)",
//         color: "#fff",
//         px: 2,
//       }}
//     >
//       <Typography
//         variant="h1"
//         sx={{
//           fontSize: { xs: "6rem", sm: "8rem", md: "10rem" },
//           fontWeight: "bold",
//           mb: 2,
//           letterSpacing: "4px",
//         }}
//       >
//         404
//       </Typography>
//       <Typography
//         variant="h5"
//         sx={{
//           mb: 3,
//           fontWeight: 500,
//           color: "rgba(255,255,255,0.85)",
//         }}
//       >
//         Oops! Page Not Found
//       </Typography>
//       <Typography
//         variant="body1"
//         sx={{
//           mb: 4,
//           maxWidth: "400px",
//           color: "rgba(255,255,255,0.7)",
//         }}
//       >
//         The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
//       </Typography>

//       <Button
//         component={Link}
//         to="/"
//         variant="contained"
//         sx={{
//           backgroundColor: "#1455b8ef",
//           color: "#fff",
//           px: 4,
//           py: 1.5,
//           fontWeight: 600,
//           "&:hover": {
//             backgroundColor: "#062678ce",
//           },
//         }}
//       >
//         Go Back Home
//       </Button>
//     </Box>
//   );
// };

// export default NotFound;



import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./NotFound.css"; // import our animation CSS

const NotFound = () => {
  return (
    <Box className="notfound-container">
      {/* floating shapes */}
      <div className="floating-shape shape1"></div>
      <div className="floating-shape shape2"></div>
      <div className="floating-shape shape3"></div>

      <Container sx={{ zIndex: 2, position: "relative", textAlign: "center" }}>
        <Typography variant="h1" className="animated-404">
          404
        </Typography>
        <Typography
          variant="h5"
          sx={{ mb: 2, color: "rgba(255,255,255,0.85)" }}
        >
          Oops! Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "rgba(255,255,255,0.7)", maxWidth: "400px", mx: "auto" }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            backgroundColor: "#f50057",
            color: "#fff",
            px: 4,
            py: 1.5,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#c51162" },
          }}
        >
          Go Back Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
