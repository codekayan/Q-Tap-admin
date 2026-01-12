import React, { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Paper,
  TextField,
  IconButton,
  Typography,
  Divider,
  Badge,
} from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Menu, MenuItem } from "@mui/material";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import axios from "axios";
import Pusher from "pusher-js";
import "./chat.css";
import { BASE_URL } from "../../utils/constants";
import { useTheme } from "@mui/system";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useGetAllChatAdmin from "../../Hooks/Queries/chat/admin/useGetAllChatAdmin";
import useGetChatByIdAdmin from "../../Hooks/Queries/chat/admin/useGetChatById";
import useSendMessageAdmin from "../../Hooks/Queries/chat/admin/useSendMessageAdmin";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import StatusMenu from "./ChatStateMenu";
import { Loader } from "../../Component/componetUi/Loader";
import ChatSettingMenu from "./ChatSettingMenu";

const ChatApp = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [messageInput, setMessageInput] = useState("");
  const [selectedChat, setSelectedChat] = useState();
  const [status, setStatus] = useState("all");
  const {
    data: chatRooms,
    isLoading, // ✅ true only when status changes OR first load
    isFetching, // true also for background polling
    error,
  } = useGetAllChatAdmin(status === "all" ? undefined : status);

  const { data: chat } = useGetChatByIdAdmin(selectedChat?.id);
  const { mutate, isPending } = useSendMessageAdmin();

  const handleSendMessage = () => {
    console.log(selectedChat?.id);
    if (!selectedChat?.id) toast.error(t("toast.error"));
    if (messageInput === "") toast.error(t("toast.error"));
    mutate(
      { message: messageInput, chat_id: selectedChat?.id },
      {
        onSuccess: (res) => {
          console.log(res);
          setMessageInput("");
        },
        onError: (err) => {
          console.log(err);
          toast.error(t("toast.error"));
        },
      }
    );
  };
  // Menu handlers
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const isMessagesLoading = false;

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    ); // 👈 first load OR new status
  }

  return (
    <Paper sx={{ height: "70vh", borderRadius: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "10px 20px",
          justifyContent: "space-between",
        }}
      >
        <div className="flex  items-center px-2">
          <Typography
            variant="body2"
            sx={{ fontSize: "12px", color: theme.palette.text.gray }}
          >
            {t("chat.liveChat")}
          </Typography>
          <IconButton
            title="reload if new customer send message"
            onClick={() => {}}
            sx={{ color: theme.palette.text.gray }}
          >
            <RefreshIcon sx={{ fontSize: "18px" }} />
          </IconButton>
        </div>
        <StatusMenu
          value={status}
          onChange={(v) => {
            setStatus(v);
            setSelectedChat(undefined);
          }}
        />
      </Box>

      <Grid container sx={{ height: "calc(70vh - 60px)" }}>
        <Grid item width="30%" sx={{ height: "100%" }}>
          <List sx={{ maxHeight: "100%", overflowY: "auto" }}>
            {Array.isArray(chatRooms?.chats) &&
              chatRooms?.chats?.map((customer) => (
                <ListItem
                  button
                  key={customer.id}
                  onClick={() => {
                    setSelectedChat(customer);
                  }}
                  sx={{
                    fontSize: "12px",
                    padding: "3px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <ListItemAvatar>
                      <Badge
                        color="error"
                        variant="dot"
                        invisible={customer?.status === "pending"}
                      >
                        <Avatar
                          sx={{
                            backgroundColor:
                              selectedChat?.id === customer.id
                                ? "#ef7d00"
                                : theme.palette.text.gray_light,
                            width: 35,
                            height: 35,
                          }}
                        >
                          <PersonOutlineOutlinedIcon
                            sx={{ fontSize: "18px" }}
                          />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography
                          style={{ marginInlineStart: "10px" }}
                          sx={{
                            fontSize: "11px",
                            color: theme.palette.text.gray_light,
                          }}
                        >
                          {customer.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          style={{ marginInlineStart: "10px" }}
                          sx={{
                            fontSize: "8px",
                            color: theme.palette.text.gray_light,
                          }}
                        >
                          <span
                            style={{
                              color:
                                customer?.status === "pending"
                                  ? theme.palette.warning.main // yellow/orange
                                  : customer?.status === "closed"
                                  ? theme.palette.error.main // red
                                  : theme.palette.text.primary, // fallback
                            }}
                          >
                            {customer?.status === "pending" &&
                              t("chat.pending")}
                            {customer?.status === "closed" && t("chat.closed")}
                          </span>
                        </Typography>
                      }
                    />
                  </Box>
                  <div className="flex">
                    <Typography
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "8px",
                        textAlign: "right",
                      }}
                    >
                      <span style={{ color: theme.palette.text.gray_light }}>
                        {new Date(customer?.updated_at).toLocaleDateString()}
                      </span>
                      <span style={{ color: theme.palette.text.gray_light }}>
                        {new Date(customer?.updated_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </Typography>
                    <ChatSettingMenu
                      chat={customer}
                    />
                  </div>
                </ListItem>
              ))}
          </List>
        </Grid>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ borderRightWidth: 1, borderColor: "#d3d3d3", height: "100%" }}
        />

        <Grid item width="65%" sx={{ height: "100%" }}>
          {selectedChat ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ padding: "0px 20px", flexGrow: 1, overflowY: "auto" }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography
                    sx={{
                      color: theme.palette.text.gray_light,
                      fontSize: "12px",
                    }}
                  >
                    {selectedChat.name}
                  </Typography>
                  <Box>
                    <LocalPhoneIcon
                      sx={{
                        fontSize: "20px",
                        color: theme.palette.text.gray_light,
                        margin: "0px 13px",
                        cursor: "pointer",
                      }}
                    />
                    <PersonOutlineOutlinedIcon
                      sx={{
                        fontSize: "20px",
                        color: theme.palette.text.gray_light,
                        cursor: "pointer",
                      }}
                      onClick={handleOpenMenu}
                    />
                  </Box>
                </Box>
                <Divider />
                {isMessagesLoading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography>Loading messages...</Typography>
                  </Box>
                ) : (
                  Array.isArray(chat?.chat?.message_chat_support) &&
                  chat?.chat?.message_chat_support?.map((msg, index) => {
                    const isUser = msg.type === "user";
                    const isRTL = document.dir === "rtl"; // or use i18n dir
                    const borderRadius = isUser
                      ? isRTL
                        ? "30px 30px 0px 30px" // user msg in RTL → left bubble
                        : "30px 30px 30px 0px" // user msg in LTR → right bubble
                      : isRTL
                      ? "30px 30px 30px 0px" // received msg in RTL → right bubble
                      : "30px 30px 0px 30px"; // received msg in LTR → left bubble
                    return (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent:
                            msg.type !== "user" ? "flex-end" : "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            bgcolor:
                              msg.type !== "user" ? "#E57C00" : "#F1F1F1",
                            color: msg.type !== "user" ? "white" : "black",
                            padding: "6px 20px",
                            margin: "3px 0px",
                            width: "50%",
                            maxWidth: "70%",
                            fontSize: "12px",
                            borderRadius: borderRadius,
                            overflowWrap: "break-word",
                          }}
                        >
                          {msg.message}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "20px 40px",
                  width: "100%",
                  gap: 1,
                  margin: "0 auto",
                }}
              >
                <TextField
                  fullWidth
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message"
                  InputProps={{
                    sx: {
                      height: "30px",
                      borderRadius: "20px",
                      backgroundColor: theme.palette.bodyColor.secandaryInput,
                      fontSize: "12px",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  sx={{ color: "#ef7d00" }}
                >
                  <span
                    className="icon-send-message"
                    style={{ fontSize: "18px", WebkitTextFillColor: "#ef7d00" }}
                  ></span>
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <IconButton>
                <WhatsAppIcon
                  sx={{ color: theme.palette.text.gray, fontSize: "55px" }}
                />
              </IconButton>
              <Typography
                variant="body1"
                sx={{ fontSize: "16px", color: theme.palette.text.gray }}
              >
                {t("chat.selectChatToStartMessage")}
              </Typography>
            </Box>
          )}
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          PaperProps={{ sx: { minWidth: "100px" } }}
        >
          <MenuItem>
            <PersonOutlineOutlinedIcon
              sx={{
                fontSize: 16,
                color: theme.palette.text.gray,
                marginRight: "10px",
              }}
            />
            <Box>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                Name:
              </Typography>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                {selectedChat ? selectedChat.name : "Name"}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem>
            <LocalPhoneOutlinedIcon
              sx={{ fontSize: 15, marginRight: "10px" }}
            />
            <Box>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                Mobile:
              </Typography>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                {selectedChat ? selectedChat.phone : "Mobile"}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem>
            <MailOutlineIcon sx={{ fontSize: 15, marginRight: "10px" }} />
            <Box>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                Email:
              </Typography>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                {selectedChat ? selectedChat.email : "Email"}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem>
            <AddLocationAltOutlinedIcon
              sx={{ fontSize: 15, marginRight: "10px" }}
            />
            <Box>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                Address:
              </Typography>
              <Typography
                sx={{ fontSize: "10px", color: theme.palette.text.gray }}
              >
                {selectedChat ? selectedChat.address : "Address"}
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Grid>
    </Paper>
  );
};

export default ChatApp;

/*
Usage example:

import StatusMenu from "@/components/StatusMenu";

export default function Example() {
  const [status, setStatus] = useState("all");

  return (
    <div>
      <StatusMenu value={status} onChange={(v) => setStatus(v)} />
      <p>Current: {status}</p>
    </div>
  );
}
*/
