import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, IconButton, Divider, TableCell, TableRow, TableBody, Table, TableHead, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ticketData from './ticketData';
import TicketDetails from './TicketDetails';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { AddQuestion } from './AddQuestion';
import DetailsModal from './DetailsModal';
import axios from 'axios';
import { toast } from 'react-toastify';

import styles from './supportCard.module.css'
import { useTranslation } from 'react-i18next';
import { AddFeedback } from './AddFeedback';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";
import { Settings } from '@mui/icons-material';
const TicketCard = ({ id, Customer_Name, Customer_Email, created_at, status, onClick }) => {
  const theme = useTheme();
  const statusStyles = {
    'in_progress': { backgroundColor: theme.palette.secondaryColor.main, color: '#f4f6fc' },
    'open': { backgroundColor: '#EBEDF3', color: '#575756' },
    'Done': { backgroundColor: '#EBEDF3', color: '#575756' },
  };

  // Format the date
  const formattedDate = new Date(created_at).toLocaleDateString();

  const { t } = useTranslation();
  return (
    <Paper
      className={status == 'in_progress' ? styles.card : styles.card2}
      elevation={3}
      sx={{
        padding: "10px",
        width: 150,
        height: 150,
        borderRadius: 6,
        position: 'relative',
        cursor: "pointer",
        backgroundColor: statusStyles[status]?.backgroundColor || '#575756',
        color: statusStyles[status]?.color || '#575756',
      }}
      onClick={onClick}
    >
      <Typography variant="body2" sx={{ fontSize: "11px", paddingBottom: "10px" }}>
        {t("ticketNo")}{id}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: "9px", paddingBottom: "10px" }}>
        {t("name")} {Customer_Name}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: "9px", paddingBottom: "10px" }}>
        {t("mail")} {Customer_Email}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: "9px", paddingBottom: "10px" }}>
        {t("date")} {formattedDate}
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: "25%",
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {status === 'in_progress' ? (
          <>
            <span className="icon-processing-time" style={{ fontSize: "13px", color: theme.palette.orangePrimary.main }} />
            <Typography variant="body1" sx={{ fontSize: "11px", color: theme.palette.orangePrimary.main, ml: 1 }}>
              {t("inProgress")}
            </Typography>
          </>
        ) : status === 'Done' ? (
          <>
            <span className="icon-check" style={{ fontSize: "13px", color: theme.palette.secondaryColor.main }} />
            <Typography variant="body1" sx={{ fontSize: "11px", color: theme.palette.secondaryColor.main, ml: 1 }}>
              {t("done")}
            </Typography>
          </>
        ) : (
          <>
            <span className="icon-share" style={{ fontSize: "12px", color: theme.palette.secondaryColor.main }} />
            <Typography variant="body1" sx={{ fontSize: "11px", color: theme.palette.secondaryColor.main, ml: 1 }}>
              {t("open")}
            </Typography>
          </>
        )}
      </Box>
    </Paper >
  );
};
const Support = () => {

  const [questions, setQuestions] = useState([
    "How much you satisfied with the product?",
    "How much you satisfied with the service?",
  ]);
  const theme = useTheme();
  const { t } = useTranslation();
  // State for AddQuestion modal
  const [openQuestionModal, setOpenQuestionModal] = useState(false);
  const handleOpenQuestionModal = () => setOpenQuestionModal(true);
  const handleCloseQuestionModal = () => setOpenQuestionModal(false);

  // State for AddFeedback modal
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const handleOpenFeedbackModal = () => setOpenFeedbackModal(true);
  const handleCloseFeedbackModal = () => setOpenFeedbackModal(false);

  // Handle adding feedback
  const addFeedback = (newFeedback) => {
    setFeedbackData([...feedbackData, {
      id: feedbackData.length + 1, // Temporary ID, replace with API response if needed
      client: { name: newFeedback.name, mobile: newFeedback.phone },
      star: newFeedback.star,
      emoji: newFeedback.emoji,
      comment: "Manual feedback" // Placeholder, adjust as needed
    }]);
  };
  const addQuestion = (newQuestion) => {
    if (newQuestion.trim() !== "") {
      setQuestions([...questions, newQuestion]);
    }
  };
  const handleDelete = (indexToRemove) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((_, index) => index !== indexToRemove)
    );
  };
  // ===============================================================

  const discounts =
    [
      { name: 'Mohamed Ahmed', phone: '010203034450', orderId: '123344', status: 'sad', rate: "2", satisfied: "3" },
      { name: 'Ahmed Alaa', phone: '010203034450', orderId: '123344', status: 'happy', rate: "4", satisfied: "8" }
    ]

  const [activeStars, setActiveStars] = useState(discounts.map(item => item.star));
  const handleStarClick = (index, rowIndex) => {
    const newStars = [...activeStars];
    newStars[rowIndex] = index + 1;
    setActiveStars(newStars);
  };
  // ============================================================
  // const [openModal, setOpenModal] = useState(false);
  // const handleOpenModel = () => {
  //   setOpenModal(true);
  // };

  // const handleCloseModel = () => {
  //   setOpenModal(false);
  // };
  // ============================================================

  const [selectedRow, setSelectedRow] = useState(null);
  const [openModalRow, setOpenModalRow] = useState(false);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setOpenModalRow(true);
  };

  const handleCloseModalRow = () => {
    setOpenModalRow(false);
  };

  //========================================== get question data 

  const [questionData, setQuestionData] = useState([]);

  const getQuestionData = async () => {
    try {

      const response = await axios.get(`${BASE_URL}faq_qtap`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('Token')}`
        }
      })

      if (response.data) {
        setQuestionData(response.data);
      }

    } catch (error) {
      console.log("error question data ", error);

    }

  }
  useEffect(() => {
    getQuestionData();
  }, [])
  //========================================== get feedback data 

  const [feedbackData, setFeedbackData] = useState([]);

  const getFeedbackData = async () => {
    try {

      const response = await axios.get(`${BASE_URL}feedback_restaurant`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('Token')}`
        }
      })

      if (response.data) {
        setFeedbackData(response.data);
      }

    } catch (error) {
      console.log("error feedback data ", error);

    }

  }
  useEffect(() => {
    getFeedbackData();
  }, [])
  //========================================== handle delete Question

  const handleDeleteQuestion = async (id) => {
    try {

      const response = await axios.delete(`${BASE_URL}faq_qtap/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('Token')}`
        }
      })

      if (response.data) {
        toast.success(t("Question deleted Success"));
        getQuestionData();
      }
    } catch (error) {
      console.log("error delete Question ", error);
      toast.error(t("Question deleted Error"));

    }
  }
  //========================================== handle delete feedback

  const handleDeleteFeedback = async (id) => {
    try {

      const response = await axios.delete(`${BASE_URL}feedback_restaurant/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('Token')}`
        }
      })

      if (response.data) {
        toast.success(t("feedbacks.deleteSucc"));
        getFeedbackData();
      }
    } catch (error) {
      console.log("error delete feedback ", error);
      toast.error(t("feedbacks.deleteErr"));

    }
  }

  ///========================================================== tickets code
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${BASE_URL}ticket`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('Token')}`
        }
      });
      setTickets(response.data);

    } catch (error) {
      console.error('Error fetching tickets:', error);
      // toast.error('Failed to fetch tickets');
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
    setCustomerName(ticket.Customer_Name || '');
    setCustomerEmail(ticket.Customer_Email || '');
    setContent(ticket.content || '');
    setStatus(ticket.status || '');
    setPhoneNumber(ticket.Customer_Phone || '');
  };

  const handleClose = () => {
    setSelectedTicket(null);
    // Reset form fields
    setCustomerName('');
    setCustomerEmail('');
    setContent('');
    setStatus('');
    setPhoneNumber('');
  };

  const addTicket = async () => {
    try {

      const data = {
        Customer_Name: customerName,
        Customer_Email: customerEmail,
        content: content,
        status: status,
        Customer_Phone: phoneNumber,
        client_id: JSON.parse(localStorage.getItem("UserData")).user.id,
        brunch_id: localStorage.getItem("selectedBranch")
      };


      const response = await axios.post(

        `${BASE_URL}ticket`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setTickets([...tickets, response.data.ticket]);
        toast.success(t("ticket.addSucc"));
        handleClose();
      }
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast.error(error.response?.data?.message || t("ticket.addErr"));
    }
  };
  const updateTicket = async () => {
    try {
      if (!selectedTicket) return;

      const data = {

        content: content,
        status: status,

      };


      const response = await axios.post(

        `${BASE_URL}ticket/${selectedTicket.id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('Token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.ticket) {
        // Update tickets list with the updated ticket
        setTickets(tickets.map(ticket =>
          ticket.id === selectedTicket.id ? response.data.ticket : ticket
        ));
        toast.success(t("ticket.updateSucc"));
        handleClose(); // Close the modal and reset form
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(error.response?.data?.message || t("ticket.updateErr"));
    }
  };
  // New states for search functionality
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
    setSearchQuery(''); // Reset search query when toggling
  };

  // Filter tickets based on search query
  const filteredTickets = tickets.filter(ticket =>
    ticket.Customer_Name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      <Paper sx={{ padding: 3, borderRadius: "10px" }}>
        <Grid container spacing={2} alignItems="center">
          {/* the header */}
          <Grid item xs={12} sx={{ display: "flex" }}>
            <Typography variant="body1" sx={{ fontSize: "12px", color: theme.palette.text.gray }}>{t("ticket.many")}</Typography>
            <Grid item xs sx={{ flexGrow: 1 }}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 1
              }}>
                {showSearch && (
                  <Box sx={{ width: '20%' }}>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name..."
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px', // Matching Paper's borderRadius
                        border: '1px solid rgba(0, 0, 0, 0.23)', // Default Material-UI border color
                        fontSize: '12px',
                        outline: 'none',
                        backgroundColor: '#fff',
                        '&:hover': {
                          borderColor: 'rgba(0, 0, 0, 0.87)'
                        }
                      }}
                    />
                  </Box>
                )}
                <IconButton onClick={handleSearchClick}>
                  <span className="icon-magnifier" style={{ fontSize: "15px", color: theme.palette.text.gray_light }} />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          {/* the tickets */}
          {filteredTickets.map((ticket, index) => (
            <Grid item key={index}>
              <TicketCard {...ticket} onClick={() => handleClickOpen(ticket)} />
            </Grid>
          ))}

          <Grid item>
            <Paper
              elevation={0}
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
                textShadow: "none",
              }}
            >
              <IconButton onClick={handleClickOpen}>
                <AddIcon sx={{ fontSize: 50, fontWeight: "bolder" }} />
              </IconButton>
            </Paper>
          </Grid>{/* add ticket */}
        </Grid>

      </Paper>


      <Paper sx={{ borderRadius: "10px", marginTop: "25px", paddingBottom: "30px", overflowX: 'auto' }}>

        <Box sx={{ padding: "30px 30px 0px 30px ", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body1" sx={{ fontSize: "13px", color: theme.palette.text.gray_light }}>
            {t("feedbacks.many")}
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Typography
              onClick={handleOpenQuestionModal}
              variant="body1"
              sx={{ fontSize: "10px", color: theme.palette.orangePrimary.main, cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <AddIcon style={{ fontSize: "20px", fontWeight: "bold" }} />
              {t("addQuestion")}
            </Typography>
            <Typography
              onClick={handleOpenFeedbackModal}
              variant="body1"
              sx={{ fontSize: "10px", color: theme.palette.orangePrimary.main, cursor: "pointer", display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <AddIcon style={{ fontSize: "20px", fontWeight: "bold" }} />
              {t("addFeedback")}
            </Typography>
          </Box>
        </Box>
        <AddQuestion open={openQuestionModal} handleCloseModel={handleCloseQuestionModal} onAddQuestion={addQuestion} getQuestionData={getQuestionData} />
        <AddFeedback open={openFeedbackModal} handleCloseModel={handleCloseFeedbackModal} onAddFeedback={addFeedback} />
        <Divider sx={{
          width: "94%", height: "2px", background: "linear-gradient(45deg, #FDB913, #F2672E)", borderRadius: "50px",
          margin: "5px 30px",
        }} />

        <Box sx={{ width: '100%', minHeight: "40px", maxHeight: "150px", overflowY: 'auto', padding: "0px 30px ", display: 'flex', flexDirection: 'column', gap: 1 }}>
          {questionData.map((question, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Typography
                sx={{
                  fontSize: '12px',
                  color: theme.palette.text.gray_light,
                }}
              >
                {question.question}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="small" onClick={() => handleDeleteQuestion(question.id)} >
                  <span className='icon-delete' style={{ fontSize: "18px", color: theme.palette.text.gray_light }}></span>
                </IconButton>
                <IconButton size="small" >
                  <Settings style={{ fontSize: "18px", color: theme.palette.text.gray_light }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Box>
        <Table sx={{ mt: 2, mb: 5, width: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.bodyColor.secandaryInput }}>
              {[
                t("customer"),
                t("mobileNumber"),
                t("orderId"),
                t("rate"),
                t("status"),
                t("details"),
                t("action"),
              ].map((header, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontSize: "10px",
                    padding: "2px",
                    borderBottom: "none",
                    textAlign: "center",
                    color: theme.palette.text.gray,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {feedbackData.map((discount, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{ height: "36px", cursor: "pointer" }}
              >
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontSize: "11px",
                    color: "gray",
                    padding: "5px 0px",
                    borderBottom: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {discount.brunch?.business_name}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontSize: "11px",
                    color: "gray",
                    padding: "5px 0px",
                    borderBottom: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  +{discount.phone}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontSize: "11px",
                    color: theme.palette.orangePrimary.main,
                    padding: "5px 0px",
                    borderBottom: "none",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  #{discount.id}
                </TableCell>
                <TableCell
                  sx={{
                    padding: "5px 0px",
                    borderBottom: "none",
                    textAlign: "center",
                  }}
                >
                  <Grid
                    container
                    spacing={0}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Grid item key={index} sx={{ display: "flex", padding: 0 }}>
                        <IconButton sx={{ padding: "2px" }}>
                          {index < discount.star ? (
                            <StarIcon
                              sx={{
                                fontSize: "16px", // Reduced size to fit better
                                color: theme.palette.orangePrimary.main,
                              }}
                            />
                          ) : (
                            <StarOutlineIcon
                              sx={{
                                fontSize: "16px",
                                color: theme.palette.orangePrimary.main,
                              }}
                            />
                          )}
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontSize: "20px",
                    color: "gray",
                    padding: "5px 0px",
                    borderBottom: "none",
                  }}
                >
                  {discount.emoji === "said" ? (
                    <SentimentVeryDissatisfiedIcon sx={{ fontSize: "30px", color: "red" }} />
                  ) : discount.emoji === "happy" ? (
                    <SentimentSatisfiedAltIcon
                      sx={{ fontSize: "30px", color: theme.palette.orangePrimary.main }}
                    />
                  ) : discount.emoji === "very happy" ? (
                    <SentimentSatisfiedAltIcon sx={{ fontSize: "30px", color: "green" }} />
                  ) : (
                    ""
                  )}
                </TableCell>
                <TableCell
                  onClick={() => handleRowClick(discount)}
                  sx={{ textAlign: "center", padding: "5px 0px", borderBottom: "none" }}
                >
                  <IconButton size="small">
                    <span
                      className="icon-information"
                      style={{ fontSize: "20px", color: theme.palette.orangePrimary.main }}
                    ></span>
                  </IconButton>
                </TableCell>
                <TableCell
                  onClick={() => handleDeleteFeedback(discount.id)}
                  sx={{ textAlign: "center", padding: "5px 0px", borderBottom: "none" }}
                >
                  <IconButton size="small" color="error">
                    <span className="icon-delete" style={{ fontSize: "20px" }}></span>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
    </>
  );
};

export default Support;
