import React, { useEffect, useState } from 'react';
import { Button, Divider, IconButton, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, useTheme } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import * as XLSX from 'xlsx';
import { AddUser } from './AddUser';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { AddRole } from './AddRole';
import { BASE_URL,BASE_URL_IMG } from "../../../../utils/constants";
import { useSelector } from 'react-redux';
import { selectSelectedBranch } from '../../../../store/client/clientAdmin';

export const UserTable = ({ userStaff, getUserStaff }) => {
  const theme = useTheme();
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);

  const branchID = useSelector(selectSelectedBranch)
  const { t } = useTranslation();
  const handleToggleVisibility = (rowId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // const handleOpen = () => setModalOpen(true);
  // const handleClose = () => setModalOpen(false);

  const handleExport = () => {
    const dataToExport = userStaff.map((row) => ({
      "User Name": row.name,
      "Created": row.created_at,
      "PIN": visiblePasswords[row.id] ? row.pin : '******',
      "Access": row.access || '',
      "Status": row.status || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "User_Data.xlsx");
  };


  // Fetch data when selectedBranch changes
  useEffect(() => {
    let isMounted = true; // Flag to prevent setting state if component is unmounted
    const fetchUserStaff = async () => {
      if (isMounted && branchID) {
        await getUserStaff(branchID);
      }
    };
    fetchUserStaff();
    return () => {
      isMounted = false; // Cleanup to prevent multiple requests
    };
  }, [branchID]); // Re-fetch data when selectedBranch changes

  // Handle delete user staff
  const handleDeleteUserStaff = async (id) => {
    try {

      const response = await axios.delete(`${BASE_URL}resturant_users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('Token')}`
        }
      });

      if (response.data) {
        toast.success(t("userStaff.deleteSucc"));
        getUserStaff(branchID); // Refresh data after deletion
      }
    } catch (error) {
      console.log("error delete UserStaff ", error);
      toast.error("Error deleting UserStaff");

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
  const filteredUserStaff = userStaff.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <Paper sx={{ padding: "15px 30px 50px 30px", borderRadius: "20px", overflow: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" padding="5px 0">
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/assets/Clients.svg" alt="icon" style={{ color: "#D8E0E0", width: "25px", height: "25px", marginRight: "10px" }} />
          <Typography variant="body1" sx={{ fontSize: "16px", color: theme.palette.text.gray }}>{t("users")}</Typography>
        </Box>


        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "70%",
          }}
        >
          {showSearch && (
            <Box sx={{ width: showSearch ? "30%" : "20%" }}>
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


          <Button onClick={() => setAddUserModalOpen(true)} sx={{ fontSize: "12px", color: theme.palette.orangePrimary.main, display: "flex", cursor: "pointer", textTransform: "capitalize" }}>
            {t("add user")}
            <span style={{ fontSize: "15px", color: theme.palette.orangePrimary.main, fontWeight: 700, paddingLeft: "6px" }}>+</span>
          </Button>
          <AddUser open={addUserModalOpen} onClose={() => {
            setAddUserModalOpen(false)
            getUserStaff(branchID)
          }} />

          <Button onClick={() => setAddRoleModalOpen(true)} sx={{ fontSize: "12px", color: theme.palette.orangePrimary.main, display: "flex", cursor: "pointer", textTransform: "capitalize" }}>
            {t("add role")}
            <span style={{ fontSize: "15px", color: theme.palette.orangePrimary.main, fontWeight: 700, paddingLeft: "6px" }}>+</span>
          </Button>
          <AddRole open={addRoleModalOpen} onClose={() => setAddRoleModalOpen(false)} />

          <Button onClick={handleExport} variant="text" sx={{ color: theme.palette.orangePrimary.main, textTransform: "capitalize", fontSize: "12px" }}>
            {t("export")}
            <ArrowForwardIosIcon sx={{ fontSize: "10px", color: theme.palette.orangePrimary.main }} />
          </Button>
        </Box>
      </Box>

      <Divider sx={{
        width: "100%", height: "2px", background: "linear-gradient(45deg, #FDB913, #F2672E)", borderRadius: "50px",
      }} />


      <Table sx={{ whiteSpace: 'nowrap' }}>
        <TableHead>
          <TableRow sx={{ height: "20px", borderBottom: `2px solid ${theme.palette.bodyColor.secandaryInput}` }}>
            {[t("userName"), t("created"), t("pin"), t("status")].map((header) => (
              <TableCell key={header} sx={{ fontSize: "12px", padding: "3px", width: `${100 / 6}%`, textAlign: "center", color: theme.palette.text.gray }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredUserStaff.map((row, index) => (
            <TableRow
              key={row.id}
              sx={{
                backgroundColor: index % 2 == 0 ? theme.palette.bodyColor.secandaryInput : '',
                height: "20px",
                borderRadius: '20px',
                '& td:first-of-type': { borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' },
                '& td:last-of-type': { borderTopRightRadius: '20px', borderBottomRightRadius: '20px' },
              }}
            >
              <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 2px", textAlign: "center", borderBottom: "none" }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {/* <PersonOutlineOutlinedIcon sx={{ padding: "5px", fontSize: "25px", backgroundColor: "white", borderRadius: "50%", mr: 1 }} /> */}
                  {row.name}
                </span>
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 2px", textAlign: "center", borderBottom: "none" }}>
                {new Date(row.updated_at).toISOString().split('T')[0].split('-').reverse().join('.')}
              </TableCell>
              <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 2px", textAlign: "center", borderBottom: "none" }}>
                {visiblePasswords[row.id] ? row.pin : '******'}
                <IconButton onClick={() => handleToggleVisibility(row.id)} sx={{ color: "gray", fontSize: "16px", marginLeft: "2px" }}>
                  {visiblePasswords[row.id] ? <VisibilityOutlinedIcon sx={{ fontSize: "18px" }} /> : <VisibilityOffOutlinedIcon sx={{ fontSize: "18px" }} />}
                </IconButton>
              </TableCell>
              {/* <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 2px", textAlign: "center", borderBottom: "none" }}>
                {row.access || ''}
              </TableCell> */}
              <TableCell sx={{ color: theme.palette.text.gray_light, fontSize: '11px', padding: "0px 2px", textAlign: "center", borderBottom: "none" }}>
                <Button sx={{
                  color: "white", textTransform: "capitalize", fontSize: "10px",
                  padding: "3px 25px", borderRadius: "20px",
                  backgroundColor: row.status === "active" ? "rgb(69, 201, 131)" : "#f05e5e",
                  "&:hover": { backgroundColor: row.status === "active" ? "#8DE6B6" : "#d04a4a" }
                }}>
                  {row.status || ''}
                </Button>
              </TableCell>
              {/* <TableCell sx={{ padding: "0px 2px", textAlign: "left", borderBottom: "none" }}>
                  <IconButton onClick={() => handleDeleteUserStaff(row.id)}>
                    <span className="icon-delete" style={{ fontSize: "16px", color: "black" }} />
                  </IconButton>
                  <IconButton>
                    <img src="/assets/setting.svg" alt="icon" style={{ width: "18px", height: "18px" }} />
                  </IconButton>
                </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default UserTable;