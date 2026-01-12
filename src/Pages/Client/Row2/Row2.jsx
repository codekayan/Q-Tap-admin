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
  IconButton,
  CircularProgress,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate } from "react-router";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../utils/constants";
import { Dashboard, Settings } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

const exportToExcel = (clients) => {
  const worksheet = XLSX.utils.json_to_sheet(clients);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clients Data");
  XLSX.writeFile(workbook, "clients_data.xlsx");
};

export const Row2 = () => {
  const theme = useTheme();
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDashboardClick = () => {
    navigate("/dashboard-home");
  };

  const handleEditClient = (client) => {
    navigate("/add-client", { state: { clientData: client, isEditMode: true } });
  };

  const handleAddClient = () => {
    navigate("/add-client", { state: { isEditMode: false } });
  };

  const fetchClients = async () => {
    const response = await fetch(`${BASE_URL}qtap_clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["qtap_clients"],
    queryFn: fetchClients,
    staleTime: 1000 * 60 * 5, // كاش لمدة 5 دقائق
  });

  

  const updateClientStatus = async (clientId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`${BASE_URL}active_clients/${clientId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      const data = await response.json();
      refetch();
      return data;
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setSearchQuery("");
  };

  const filterClients = data?.qtap_clients?.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: "0 20px", marginTop: "20px" }}>
      <Paper sx={{ padding: "20px", borderRadius: 5, height: "360px" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h5"
            sx={{
              color: theme.palette.text.gray,
              display: "flex",
              fontSize: "18px",
              alignItems: "center",
              marginLeft: "20px",
            }}
          >
            <img
              src="/assets/Clients.svg"
              alt="icon"
              style={{
                color: "#D8E0E0",
                width: "22px",
                height: "22px",
                marginRight: "12px",
                opacity: 0.5,
              }}
            />
            {t("client")}
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              {showSearch && (
                <Box sx={{ width: showSearch ? "100%" : "20%" }}>
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
            </Box>

            {/* <Button
              onClick={handleAddClient}
              sx={{
                color: theme.palette.orangePrimary.main,
                textTransform: "capitalize",
                fontSize: "12px",
              }}
            >
              {t("add")}
              <AddIcon sx={{ color: "#575756", fontSize: "12px" }} />
            </Button> */}

            <Button
              onClick={() => exportToExcel(data?.qtap_clients || [])}
              sx={{
                color: theme.palette.orangePrimary.main,
                textTransform: "capitalize",
                fontSize: "12px",
                display: "flex",
                gap: 1,
              }}
            >
              {t("export")}
              <ArrowForwardIosOutlinedIcon
                sx={{ color: "#575756", fontSize: "10px" }}
              />
            </Button>
          </Box>
        </Box>

        <TableContainer
          sx={{
            height: "300px",
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.orangePrimary.main,
              borderRadius: "4px",
              width: "2px",
              "&:hover": {
                background: theme.palette.orangePrimary.main,
              },
            },
          }}
        >
          <Table
            size="small"
            sx={{ borderCollapse: "separate", borderSpacing: "0 5px", whiteSpace: "nowrap" }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    color: theme.palette.text.gray,
                    fontSize: "12px",
                    padding: "0px",
                    borderBottom: "none",
                    width: `${100 / 6}%`,
                    textAlign: "start",
                    paddingLeft: "35px",
                  }}
                >
                  {t("business")}
                </TableCell>
                {[t("data"), t("city"), t("bundle"), t("status"), ""].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: theme.palette.text.gray,
                      fontSize: "12px",
                      padding: "0px",
                      borderBottom: "none",
                      width: `${100 / 6}%`,
                      textAlign: "center",
                      paddingLeft: { xs: "2px" },
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", padding: "100px 20px" }}
                  >
                    <CircularProgress sx={{ color: theme.palette.orangePrimary.main }} />
                  </TableCell>
                </TableRow>
              ) : data?.qtap_clients?.length > 0 ? (
                filterClients.slice().reverse().map((row, index) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? theme.palette.bodyColor.whiteGray : "",
                      height: "5px",
                      borderRadius: "20px",
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
                        color: theme.palette.text.gray,
                        fontSize: "11px",
                        padding: "0px",
                        width: `${100 / 6}%`,
                        textAlign: "left",
                        paddingLeft: "20px",
                        borderBottom: "none",
                        lineHeight: "1",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                          display: "inline-flex",
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          marginRight: "8px",
                          width: "20px",
                          height: "20px",
                          lineHeight: "0",
                          color: "#686666",
                        }}
                      >
                        <PersonOutlineOutlinedIcon sx={{ fontSize: "14px" }} />
                      </span>
                      {row.name}
                    </TableCell>

                    <TableCell
                      sx={{
                        lineHeight: "1",
                        color: theme.palette.text.gray,
                        fontSize: "11px",
                        padding: "0px",
                        width: `${100 / 6}%`,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {row.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        lineHeight: "1",
                        color: theme.palette.text.gray,
                        fontSize: "11px",
                        padding: "0px",
                        width: `${100 / 6}%`,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {row.country}
                    </TableCell>
                    <TableCell
                      sx={{
                        lineHeight: "1",
                        color: theme.palette.text.gray,
                        fontSize: "11px",
                        padding: "0px",
                        width: `${100 / 6}%`,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      {row.birth_date}
                    </TableCell>

                    <TableCell
                      onClick={() => updateClientStatus(row.id, row.status)}
                      sx={{
                        padding: "0px",
                        width: `${100 / 6}%`,
                        textAlign: "center",
                        borderBottom: "none",
                        lineHeight: "1",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor:
                            row.status === "Confirm Payment"
                              ? theme.palette.secondaryColor.main
                              : null,
                          borderRadius:
                            row.status === "Confirm Payment" ? "20px" : "0px",
                          color:
                            row.status === "active"
                              ? theme.palette.orangePrimary.main
                              : row.status === "inactive"
                                ? "gray"
                                : "white",
                          padding:
                            row.status === "Confirm Payment" ? "5px 9px" : "12px",
                          fontSize: row.status === "Confirm Payment" ? "10px" : "11px",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "6px",
                            height: "6px",
                            backgroundColor:
                              row.status === "active"
                                ? theme.palette.orangePrimary.main
                                : "gray",
                            borderRadius: "50%",
                            marginRight: "5px",
                          }}
                        ></span>
                        {t(row.status)}
                      </span>
                    </TableCell>

                    <TableCell
                      sx={{
                        lineHeight: "1",
                        padding: "0px",
                        width: `${100 / 6}%`,
                        textAlign: "center",
                        borderBottom: "none",
                      }}
                    >
                      <IconButton onClick={handleDashboardClick}>
                        <Dashboard
                          style={{ cursor: "pointer", color: theme.palette.bodyColor.gray_lightBlack50, fontSize: "20px" }}
                        />
                      </IconButton>
                      <IconButton onClick={() => handleEditClient(row)}>
                        <Settings
                          style={{ cursor: "pointer", color: theme.palette.bodyColor.gray_lightBlack50, fontSize: "20px" }}
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{ textAlign: "center", padding: "20px" }}
                  >
                    No clients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Row2;