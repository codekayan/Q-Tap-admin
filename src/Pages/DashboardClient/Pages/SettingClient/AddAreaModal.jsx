import  {  useState } from 'react';
import { Box, Modal, TextField, Button, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from "../../../../utils/constants"
import { useDispatch, useSelector } from "react-redux";
import { selectAreaData,  createArea, deleteArea, updateArea } from "../../../../store/client/clientAdmin"

const AddAreaModal = ({ open, onClose }) => {
    const [name, setName] = useState('');
    const [editingAreaId, setEditingAreaId] = useState(null); // حالة لحفظ ID المنطقة التي يتم تعديلها
    const selectedBranch = localStorage.getItem("selectedBranch");

    const dispatch = useDispatch() //
    const areaData = useSelector(selectAreaData)
    const { areas } = areaData;
    

    //========================================== حفظ منطقة جديدة
    const handleSaveArea = async () => {
        if (name === '') {
            toast.error('Please fill all fields');
            return;
        }
        try {

            const response = await axios.post(`${BASE_URL}area`, {
                brunch_id: selectedBranch,
                name
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('Token')}`
                }
            });

            if (response.data) {
                toast.success("Area added successfully!");
                dispatch(createArea(response.data?.area));
                setName('');
            }
        } catch (error) {
            console.log("Error adding area", error);
            toast.error("Error adding area");
        }
    };

    //========================================== تحديث المنطقة
    const handleUpdateArea = async (id) => {
        if (name === '') {
            toast.error('Please fill all fields');
            return;
        }

        try {

            const response = await axios.post(`${BASE_URL}area/${id}`, {
                brunch_id: selectedBranch,
                name
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('Token')}`
                }
            });

            if (response.data) {
                toast.success("Area updated successfully!");
                dispatch(updateArea(response.data.area));
                setName('');
                setEditingAreaId(null); // إعادة تعيين ID التعديل بعد التحديث
            }
        } catch (error) {
            console.log("Error updating area", error);
            toast.error("Error updating area");
        }
    };

    //========================================== حذف المنطقة
    const handleDeleteArea = async (id) => {
        try {

            const response = await axios.delete(`${BASE_URL}area/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem('Token')}`
                }
            });

            if (response.data) {
                toast.success("Area deleted successfully!");
                dispatch(deleteArea(id));
            }
        } catch (error) {
            console.log("Error deleting area", error);
            toast.error("Error deleting area");
        }
    };

    //========================================== عند الضغط على زر التعديل
    const handleUpdateClick = (area) => {
        setName(area.name);  // إدخال اسم المنطقة في الحقل
        setEditingAreaId(area.id);  // حفظ ID المنطقة التي يتم تعديلها
    };

    //========================================== عند الضغط على زر الحفظ
    const handleSubmit = () => {
        if (editingAreaId) {
            handleUpdateArea(editingAreaId); // تحديث المنطقة إذا كان هناك تعديل
        } else {
            handleSaveArea(); // إضافة منطقة جديدة
        }
    };

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="add-area-modal" aria-describedby="add-area-description">
            <Box
                sx={{
                    width: 400,
                    bgcolor: 'background.paper',
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 24,
                    mx: 'auto',
                    mt: '20vh',
                    position: 'relative'
                }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ fontSize: "13px", color: "#424242" }}>
                        {editingAreaId ? "Update Area" : "Add Area"}
                    </Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon sx={{ fontSize: "20px", color: "gray" }} />
                    </IconButton>
                </Box>

                <Divider sx={{ backgroundColor: '#FF6600', height: '1px' }} />
                <Box sx={{ marginTop: "20px", display: "flex", flexDirection: "column", width: "100%", alignItems: "left" }}>
                    <Typography variant='body2' sx={{ width: "25%", textAlign: "center" }} color={"#424242"} fontSize={"12px"}>
                        Name
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                        <TextField
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={{
                                width: "90%",
                                '& .MuiInputBase-input': {
                                    height: "35px",
                                    padding: "0px 14px",
                                    textAlign: "left",
                                    fontSize: "12px",
                                    color: "gray",
                                }
                            }}
                            fullWidth
                            placeholder="Table Name"
                        />
                    </Box>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color="warning"
                        sx={{
                            mt: 4,
                            mb: 2,
                            borderRadius: '20px',
                            height: "30px",
                            width: "30%",
                            textTransform: "capitalize",
                        }}
                    >
                        <AddOutlinedIcon sx={{ fontSize: "18px", color: "white", mr: 1 }} />
                        {editingAreaId ? 'Update' : 'Add'}
                    </Button>
                </Box>

                <TableContainer sx={{ marginTop: "20px", marginBottom: "20px", width: "400px", marginLeft: "-32px" }}>
                    <Table sx={{ width: "100%" }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ height: "24px" }}>
                                <TableCell align="center" sx={{ fontSize: "10px", borderBottom: "none", backgroundColor: '#EBEDF3', padding: "0px" }}>Name</TableCell>
                                <TableCell align="center" sx={{ fontSize: "10px", borderBottom: "none", backgroundColor: '#EBEDF3', padding: "0px" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {areas?.filter(area => { return area?.brunch_id == Number(selectedBranch) }).map((row) => (
                                <TableRow key={row.id} sx={{ height: "30px" }}>
                                    <TableCell align="center" sx={{ padding: "0px", fontSize: "10px", color: "gray" }}>{row.name}</TableCell>
                                    <TableCell align="center" sx={{ padding: "0px" }}>
                                        <IconButton onClick={() => handleUpdateClick(row)} size="small">
                                            <span class="icon-edit" style={{ fontSize: "18px" }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteArea(row.id)} size="small" color='error'>
                                            <span class="icon-delete" style={{ fontSize: "18px" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Modal>
    );
};

export default AddAreaModal;
