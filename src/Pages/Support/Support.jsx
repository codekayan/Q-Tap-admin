import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import TicketDetails from "../DashboardClient/Pages/SupportClient/TicketDetails";
import ChatApp from "./ChatApp";
import axios from "axios";
import { toast } from "react-toastify";
import DetailsModal from "../DashboardClient/Pages/SupportClient/DetailsModal";
import styles from "../DashboardClient/Pages/SupportClient/supportCard.module.css";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../utils/constants";

const TicketCard = ({
  id,
  Customer_Name,
  Customer_Email,
  created_at,
  status,
  onClick,
}) => {
  const theme = useTheme();
  const statusStyles = {
    in_progress: {
      backgroundColor: theme.palette.secondaryColor.main,
      color: "#f4f6fc",
    },
    open: { backgroundColor: "#EBEDF3", color: "#575756" },
    Done: { backgroundColor: "#EBEDF3", color: "#575756" },
  };

  // Format the date
  const formattedDate = new Date(created_at).toLocaleDateString();
  // console.log(status, "status ");
  const { t } = useTranslation();

  return (
    <Paper
      className={status === "in_progress" ? styles.card : styles.card2}
      elevation={3}
      sx={{
        padding: "10px",
        width: 150,
        height: 150,
        borderRadius: 6,
        position: "relative",
        cursor: "pointer",
        backgroundColor: statusStyles[status]?.backgroundColor || "#575756",
        color: statusStyles[status]?.color || "#575756",
      }}
      onClick={onClick}
    >
      <Typography
        variant="body2"
        sx={{ fontSize: "11px", paddingBottom: "10px" }}
      >
        {t("ticketNO")}
        {id}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontSize: "9px", paddingBottom: "10px" }}
      >
        {t("name")} {Customer_Name}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontSize: "9px", paddingBottom: "10px" }}
      >
        {t("mail")} {Customer_Email}
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontSize: "9px", paddingBottom: "10px" }}
      >
        {t("date")} {formattedDate}
      </Typography>
      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: "25%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {status === "in_progress" ? (
          <>
            <span
              className="icon-processing-time"
              style={{
                fontSize: "13px",
                color: theme.palette.orangePrimary.main,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "11px",
                color: theme.palette.orangePrimary.main,
                ml: 1,
              }}
            >
              {t("inProgress")}
            </Typography>
          </>
        ) : status === "Done" ? (
          <>
            <span
              className="icon-check"
              style={{
                fontSize: "13px",
                color: theme.palette.secondaryColor.main,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "11px",
                color: theme.palette.secondaryColor.main,
                ml: 1,
              }}
            >
              {t("done")}
            </Typography>
          </>
        ) : (
          <>
            <span
              className="icon-share"
              style={{
                fontSize: "12px",
                color: theme.palette.secondaryColor.main,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontSize: "11px",
                color: theme.palette.secondaryColor.main,
                ml: 1,
              }}
            >
              {t("open")}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  );
};

const Support = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [openModalRow, setOpenModalRow] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpenModalRow(true);
  };

  const handleCloseModalRow = () => {
    setOpenModalRow(false);
  };
  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}ticket_client`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // toast.error('Failed to fetch tickets');
      // toast.error(t("faildFetchTickets"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleClickOpen = (ticket) => {
    setSelectedTicket(ticket);
    // Populate form fields with ticket data
    setCustomerName(ticket.Customer_Name || "");
    setCustomerEmail(ticket.Customer_Email || "");
    setContent(ticket.content || "");
    setStatus(ticket.status || "");
    setPhoneNumber(ticket.Customer_Phone || "");
  };

  const handleClose = () => {
    setSelectedTicket(null);
    // Reset form fields
    setCustomerName("");
    setCustomerEmail("");
    setContent("");
    setStatus("");
    setPhoneNumber("");
  };

  const updateTicket = async () => {
    try {
      if (!selectedTicket) return;

      const data = {
        content: content,
        status: status,
      };

      const response = await axios.put(
        `${BASE_URL}ticket_client/${selectedTicket.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.ticket) {
        // Update tickets list with the updated ticket
        setTickets(
          tickets.map((ticket) =>
            ticket.id === selectedTicket.id ? response.data.ticket : ticket
          )
        );
        toast.success(t("ticketUpdatedSucc"));
        handleClose(); // Close the modal and reset form
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error(error.response?.data?.message || t("faildToUpdateTicket"));
    }
  };

  const addTicket = async () => {
    try {
      const data = {
        Customer_Name: customerName,
        Customer_Email: customerEmail,
        content: content,
        status: status,
        Customer_Phone: phoneNumber,
        client_id: "10",
        brunch_id: localStorage.getItem("selectedBranch"),
      };

      // console.log(" dat2a add", data);

      const response = await axios.post(`${BASE_URL}ticket_client`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        setTickets([...tickets, response.data.ticket]);
        toast.success(t("ticketAddedSucc"));
        handleClose();
      }
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast.error(error.response?.data?.message || t("faildToAddTicket"));
    }
  };
  // New states for search functionality
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setSearchQuery(""); // Reset search query when toggling
  };

  // Filter tickets based on search query
  const filteredTickets = tickets.filter((ticket) =>
    ticket.Customer_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Box sx={{ padding: "0px 20px" }}>
      <Grid sx={{ marginBottom: "15px" }}>
        <ChatApp />
      </Grid>

      <Paper sx={{ padding: "10px 20px", borderRadius: "20px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{ fontSize: "12px", color: theme.palette.text.gray }}
            >
              {t("ticket.one")}
            </Typography>
            <Grid item xs>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {showSearch && (
                  <Box sx={{ width: "20%" }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name..."
                      style={{
                        width: "100%",
                        padding: "6px 8px",
                        borderRadius: "6px", // Matching Paper's borderRadius
                        border: "1px solid rgba(0, 0, 0, 0.23)", // Default Material-UI border color
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
              </Box>
            </Grid>
          </Grid>

          {filteredTickets.map((ticket) => (
            <Grid item key={ticket.id}>
              <TicketCard {...ticket} onClick={() => handleClickOpen(ticket)} />
            </Grid>
          ))}

          {/* <Grid item>
            <Paper
              elevation={3}
              sx={{
                width: 150,
                height: 150,
                borderRadius: 6,
                padding: 2,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ECECEC',
                cursor: "pointer",
              }}
            >
              <IconButton onClick={handleClickOpen}>
                <AddIcon sx={{ fontSize: 50, fontWeight: "bolder" }} />
              </IconButton>            </Paper>
          </Grid> */}
        </Grid>
      </Paper>

      {selectedTicket && (
        <TicketDetails
          open={Boolean(selectedTicket)}
          handleClose={handleClose}
          ticket={selectedTicket}
          customerName={customerName}
          customerEmail={customerEmail}
          content={content}
          status={status}
          phoneNumber={phoneNumber}
          setCustomerName={setCustomerName}
          setCustomerEmail={setCustomerEmail}
          setContent={setContent}
          setStatus={setStatus}
          setPhoneNumber={setPhoneNumber}
          updateTicket={updateTicket}
          addTicket={addTicket}
        />
      )}
      {selectedRow && (
        <DetailsModal
          open={openModalRow}
          onClose={handleCloseModalRow}
          rowData={selectedRow}
        />
      )}
    </Box>
  );
};

export default Support;
