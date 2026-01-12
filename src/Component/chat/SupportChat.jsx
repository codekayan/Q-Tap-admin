import { useState } from "react";
import { Box, IconButton, useTheme } from "@mui/material";

import { UserInfoForm } from "./UserInfoForm";
import { useChatDataStore } from "../../store/zustand-store/user-chat-data-store";
import SupportChatCard from "./ChatCard";
import { useAuthStore } from "../../store/zustand-store/authStore";
function MySvgIcon({ fill = "#E57C00" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="8370 65 60 60" // adjust viewBox so the shape is visible
      width="25px"
      height="25px"
    >
      <path
        d="M 8413.087890625 68.78399658203125 
           L 8384.279296875 68.78399658203125 
           C 8381.033203125 68.78399658203125 8378.41015625 71.40563201904297 8378.41015625 74.63095092773438 
           L 8378.41015625 103.2599563598633 
           C 8378.41015625 106.4852752685547 8381.033203125 109.0927047729492 8384.279296875 109.0927047729492 
           L 8411.126953125 109.0927047729492 
           L 8418.9716796875 116.1057739257812 
           L 8418.9716796875 74.63095092773438 
           C 8418.9716796875 71.40563201904297 8416.33203125 68.78399658203125 8413.087890625 68.78399658203125 
           Z 
           M 8398.68359375 102.5737838745117 
           C 8393.4765625 102.5737838745117 8388.78125 100.3503265380859 8385.5078125 96.80931854248047 
           L 8387.33203125 95.20375061035156 
           C 8390.30078125 97.98965454101562 8394.2919921875 99.69121551513672 8398.68359375 99.69121551513672 
           C 8403.0751953125 99.69121551513672 8407.0791015625 97.98965454101562 8410.021484375 95.20375061035156 
           L 8411.8583984375 96.80931854248047 
           C 8408.599609375 100.3503265380859 8403.904296875 102.5737838745117 8398.68359375 102.5737838745117 
           Z"
        fill={`${fill}`}
      />
    </svg>
  );
}

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const { isLogged } = useChatDataStore();
  const { user } = useAuthStore();
  return (
    <>
      {/* Button renders inline in header */}
      <IconButton
        color="inherit"
        onClick={toggleChat}
        sx={{
          marginInlineEnd: "30px",
          padding: "5px",
          "&:hover": {
            backgroundColor: "transparent", // removes hover background
          },
        }}
      >
        {/* <img
                    src="/images/help.jpg"
                    alt="icon"
                    style={{ width: "20px", height: "20px", }}
                /> */}
        <MySvgIcon />
      </IconButton>

      {/* Floating Chat Panel */}
      {isOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 1300, // above app bar
          }}
        >
          {isLogged || user ? (
            <SupportChatCard setOpen={setIsOpen} />
          ) : (
            <UserInfoForm toggleChat={toggleChat} />
          )}
        </Box>
      )}
    </>
  );
}
