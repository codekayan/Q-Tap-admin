import { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import useGetChat from "../../Hooks/Queries/chat/user/useGetChat"; // 👈 your hook
import useRegisterChat from "../../Hooks/Queries/chat/user/useRegisterChat"; // 👈 your hook
import { useChatDataStore } from "../../store/zustand-store/user-chat-data-store";
import useSendMessage from "../../Hooks/Queries/chat/user/useSendMessage";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/zustand-store/authStore";

export default function SupportChatCard({ setOpen }) {
  const [message, setMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();

  const loggedData = useChatDataStore((state) => state.loggedData);
  const chat_room_id = useChatDataStore((state) => state.chat_room_id);
  const { user } = useAuthStore();
  const chatData = useChatDataStore();
  // Fetch chat messages (polling every 2s)
  const { data, isPending, isError, isEnabled } = useGetChat(loggedData.email);
  const { mutate, isPending: isSendPending } = useRegisterChat();
  const { mutate: mutateSend, isPending: isSendPendingOnSame } =
    useSendMessage();

  const handleSend = async () => {
    if (!message.trim()) return;
    // 3. Reset input
    console.log(chatData);
    if (chat_room_id) {
      mutateSend(
        {
          chat_id: chat_room_id,
          message,
        },
        {
          onSuccess: () => {},
          onError: (err) => {
            console.log(err);
          },
        }
      );
    } else {
      console.log("intiate chat");
      mutate(
        {
          name: loggedData?.name || user?.name,
          email: loggedData?.email || user?.email,
          message,
        },
        {
          onSuccess: () => {},
          onError: (err) => {
            console.log(err);
          },
        }
      );
    }
    setMessage("");
  };

  // Merge server messages + local optimistic ones
  const messages = [...(data?.chat?.message_chat_support || [])];
  // Handle settings menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleClearChat = () => {
    handleMenuClose();
  };
  return (
    <Box
      className="flex-1"
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1300,
      }}
    >
      {/* Chat Card */}
      <Card sx={{ width: 320, boxShadow: 6, borderRadius: 2 }}>
        <CardContent
          className="justify-between flex-1"
          style={{ padding: "0px" }}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 0,
          }}
        >
          <div>
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "primary.main",
                color: "white",
                px: 2,
                py: 1,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon sx={{ color: "white" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleClearChat}>
                  {t("chat.clearChat")}
                </MenuItem>
              </Menu>
              <Typography variant="subtitle1">
                {t("chat.supportChat")}
              </Typography>
              <IconButton size="small" onClick={() => setOpen(false)}>
                <CloseIcon sx={{ color: "white" }} />
              </IconButton>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                bgcolor: "#f9f9f9",
                height: 200,
                overflowY: "auto",
                p: 2,
                fontSize: 14,
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {chat_room_id === null ? (
                <Typography color="text.secondary">
                  {t("chat.sendMesToStartChat")}
                </Typography>
              ) : (
                <>
                  {isPending && (
                    <Typography color="text.secondary">
                      {t("chat.loading")}
                    </Typography>
                  )}
                  {isError && (
                    <Typography color="error">
                      {t("chat.faildToLoadMessagee")}
                    </Typography>
                  )}
                  {Array.isArray(messages) &&
                    [...messages].reverse().map((msg, i) => (
                      <Typography
                        key={i}
                        sx={{
                          alignSelf:
                            msg.type === "user" ? "flex-end" : "flex-start",
                          bgcolor:
                            msg.type === "user" ? "primary.main" : "grey.300",
                          color: msg.type === "user" ? "white" : "black",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          maxWidth: "80%",
                        }}
                      >
                        {msg.message}
                      </Typography>
                    ))}
                </>
              )}
            </Box>
          </div>

          {/* Input */}
          <Box sx={{ display: "flex", gap: 1, p: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder={t("chat.inputPlaceHolder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disable={isSendPending || isSendPendingOnSame}
            >
              {isSendPending || isSendPendingOnSame
                ? t("chat.loading")
                : t("chat.send")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
// import { useState } from "react"

// async function fetchMessages() {
//   const res = await fetch("/api/messages")
//   return res.json()
// }

// async function sendMessage(newMessage: string) {
//   const res = await fetch("/api/messages", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ text: newMessage }),
//   })
//   return res.json()
// }

// export default function Chat() {
//   const queryClient = useQueryClient()
//   const [message, setMessage] = useState("")

//   // 🔄 Keep polling every 2s for new messages
//   const { data: messages, isLoading } = useQuery({
//     queryKey: ["messages"],
//     queryFn: fetchMessages,
//     refetchInterval: 2000, // 👈 live updates via polling
//   })

//   const mutation = useMutation({
//     mutationFn: sendMessage,
//     onSuccess: () => {
//       // Refresh messages immediately after sending
//       queryClient.invalidateQueries({ queryKey: ["messages"] })
//     },
//   })

//   const handleSend = () => {
//     if (message.trim()) {
//       mutation.mutate(message)
//       setMessage("")
//     }
//   }

//   return (
//     <div>
//       <div>
//         {isLoading ? (
//           <p>Loading...</p>
//         ) : (
//           messages?.map((m: any, i: number) => <p key={i}>{m.text}</p>)
//         )}
//       </div>

//       <input
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type a message"
//       />
//       <button onClick={handleSend}>Send</button>
//     </div>
//   )
// }
