import { Box, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/system";

export const Loader = () => {
    const theme = useTheme()
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        backgroundColor: "rgba(245, 245, 245, 0.26)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress
        sx={{
          fontSize: 60,
          color: theme.palette.orangePrimary.main,
          animation: "spin 1s linear infinite",
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};
