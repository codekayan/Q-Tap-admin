import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Menu,
  IconButton,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { BASE_URL, BASE_URL_IMG } from "../../../utils/constants";
import { Settings } from "@mui/icons-material";

export const Users = () => {
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState([]);
  const [inactiveUsers, setInactiveUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation()
  const theme = useTheme();
  const handleClick = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);

  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };


  const getUsers = async () => {
    try {
      const response = await axios.get(

        `${BASE_URL}affiliate`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (response.data.success) {
        setActiveUsers(response.data.affiliates_active || []);
        setInactiveUsers(response.data.affiliates_inactive || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // active users
  const handleActiveUsers = async (userId, currentStatus) => {

    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const response = await axios.post(

        `${BASE_URL}qtap_affiliate/${userId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      getUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.delete(

        `${BASE_URL}affiliate/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      getUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const exportToExcel = () => {
    const allUsers = [...activeUsers, ...inactiveUsers];
    const worksheet = XLSX.utils.json_to_sheet(allUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  useEffect(() => {
    let isMounted = true; // Flag to prevent setting state if component is unmounted
    const fetchUsers = async () => {
      if (isMounted) {
        await getUsers();
      }
    };
    fetchUsers();
    return () => {
      isMounted = false; // Cleanup to prevent multiple requests
    };
  }, []);

  const allUsers = [...activeUsers, ...inactiveUsers];
  // New states for search functionality
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setSearchQuery(''); // Reset search query when toggling
  };

  // Filter tickets based on search query
  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box>
      <Paper sx={{ padding: "15px", borderRadius: 5, minHeight: "60vh", maxHeight: "82vh" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          textAlign="center"
          alignItems="center"
          mb={1}
        >
          <Typography
            variant="h5"
            color={theme.palette.text.gray}
            sx={{ display: "flex", fontSize: "14px", alignItems: "center" }}
          >
            <Box sx={{ fill: "#D8E0E0" }}>
              <img
                src="/assets/Clients.svg"
                alt="icon"
                style={{
                  filter:
                    "invert(86%) sepia(7%) saturate(400%) hue-rotate(125deg) brightness(95%) contrast(92%)",
                  width: "22px",
                  height: "23px",
                  marginRight: "10px",
                }}
              />
            </Box>
            {t("users")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {showSearch && (
              <Box sx={{ width: showSearch ? "60%" : "20%" }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name..."
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "1px solid rgba(0, 0, 0, 0.23)",
                    fontSize: "12px",
                    outline: "none",
                    backgroundColor: "#fff",
                    "&:hover": {
                      borderColor: "rgba(0, 0, 0, 0.87)",
                    },
                  }}
                />
              </Box>
            )}
            <IconButton onClick={handleSearchClick}>
              <span
                className="icon-magnifier"
                style={{ fontSize: "15px", color: theme.palette.text.gray }}
              />
            </IconButton>
            <Button
              onClick={() => navigate("/add-user")}
              sx={{
                color: theme.palette.orangePrimary.main,
                textTransform: "capitalize",
                fontSize: "12px",
              }}
            >
              {t("add")}
              <AddIcon sx={{ color: theme.palette.text.gray, fontSize: "12px" }} />
            </Button>
            <Button
              onClick={exportToExcel}
              sx={{
                color: theme.palette.orangePrimary.main,
                textTransform: "capitalize",
                fontSize: "11px",
              }}
            >
              {t("export")}{" "}
              <ArrowForwardIosOutlinedIcon
                sx={{ color: theme.palette.text.gray, fontSize: "10px" }}
              />
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: "70vh", overflowY: "auto" }}>
          <Table sx={{ borderCollapse: "separate", borderSpacing: "0 5px" }}>
            <TableHead>
              <TableRow sx={{ height: "20px" }}>
                {[t("name"), t("id"), t("email"), t("status"), ""].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontSize: "10px",
                      padding: "0px 10px",
                      borderBottom: "none",
                      color: theme.palette.text.gray,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  sx={{
                    height: "20px",
                    backgroundColor: index % 2 === 0 ? theme.palette.bodyColor.secandaryInput : "",
                    "& td:first-of-type": {
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                    },
                    "& td:last-of-type": {
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontSize: "10px",
                      padding: "0px 8px",
                      borderBottom: "none",
                      textAlign: "center",

                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: "5px",
                          width: "22px",
                          height: "22px",
                          color: "#686666",
                          textAlign: "center",

                        }}
                      >
                        {user.img ? (
                          <img
                            src={`${BASE_URL_IMG}${user.img}`}
                            alt={user.name}
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <PersonOutlineOutlinedIcon
                            sx={{ fontSize: "15px" }}
                          />
                        )}
                      </span>
                      {user.name}
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: "10px",
                      padding: "0px 8px",
                      borderBottom: "none",
                    }}
                  >
                    #{user.id}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: "10px",
                      padding: "0px 8px",
                      borderBottom: "none",
                    }}
                  >
                    {user.email}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontSize: "11px",
                      padding: "0px 8px",
                      borderBottom: "none",
                    }}
                  >
                    <span
                      onClick={() => handleActiveUsers(user.id, user.status)}
                      style={{
                        color:
                          user.status === "active" ? theme.palette.orangePrimary.main : "#575756",
                        borderRadius: "30px",
                        padding: "3px 10px 10px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"

                      }}
                    >
                      <span style={{ color: user.status === "active" ? theme.palette.orangePrimary.main : "#575756", fontWeight: "bolder", fontSize: "20px", marginRight: "3px" }}>&#8226; </span>
                      {t(user.status.charAt(0).toUpperCase() + user.status.slice(1))}
                    </span>
                  </TableCell>

                  <TableCell sx={{ padding: "0px 8px", borderBottom: "none" }}>
                    <IconButton onClick={(e) => handleClick(e, user)}>
                      <DragHandleIcon
                        sx={{ color: theme.palette.text.gray, fontSize: "16px" }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              width: 90,
              boxShadow: "0px 0px 1px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <Box
            onClick={() => {
              navigate("/add-user", { state: { user: selectedUser } });
              handleClose();
            }}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <IconButton>
              <Settings
                style={{ width: "16px", height: "16px" , color: theme.palette.text.gray }}
              />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.gray, fontSize: "10px" }}
            >
              Edit
            </Typography>
          </Box>
          <Box
            onClick={() => {
              handleDeleteUser(selectedUser.id);
              handleClose();
            }}
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <IconButton>
              <span className="icon-delete" style={{ fontSize: "15px", color: theme.palette.text.gray }}></span>
            </IconButton>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.gray, fontSize: "10px" }}
            >
              Delete
            </Typography>
          </Box>
        </Menu>
      </Paper>
    </Box >
  );
};
