import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";



export default function Content() {

    return (
            <Box component="main" sx={{
                flexGrow: 1, p: 3,
            }}>

                <Outlet />

            </Box>
    );
}
