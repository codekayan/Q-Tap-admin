import React, { useState } from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box
} from "@mui/material";
import NewUsersTableComponent from "./NewUsersTableComponent";




export default function NewUserTable() {


    // "active","inactive","expired","pending"
    const [selectedStatus, setSelectedStatus] = useState('');
    const statusOptions = ['Active', 'Inactive', 'Pending', 'expired'];



    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };




    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <FormControl style={{ marginBottom: 16, minWidth: 200, marginInlineStart: "auto" }}>
                    <InputLabel id="status-label" shrink>Status</InputLabel>
                    <Select
                        labelId="status-label"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        label="Status"
                        displayEmpty
                        renderValue={(selected) => {
                            if (selected === '') {
                                return 'All';
                            }
                            return selected;
                        }}
                    >
                        <MenuItem value="">All</MenuItem>
                        {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <NewUsersTableComponent  selectedStatus={selectedStatus} />
        </>
    );
}
