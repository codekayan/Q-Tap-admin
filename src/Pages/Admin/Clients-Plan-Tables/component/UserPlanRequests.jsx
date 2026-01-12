import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
    Box
} from "@mui/material";
import { useGetClientPlanRequest } from "../../../../Hooks/Queries/admin/plan/useGetClientsPlanRequests";
import PaginationComponent from "./PaginationComponent";
import { useHandlePlanRequest } from "../../../../Hooks/Queries/admin/plan/actions/useHandlePlanRequest";
import { useQueryClient } from "@tanstack/react-query";



export default function UserPlanRequests() {
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient()


    const { data, isPending } = useGetClientPlanRequest(page)

    const { mutate, isPaused: isActionPending } = useHandlePlanRequest()

    const pageData = data?.data?.requests

    const rows = data?.data?.requests?.data || []

    console.log(rows)

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const handleCloseDialog = () => {
        setSelectedRow(null);
    };

    const handleRequestAction = (action, request_id, e) => {
        // action : Accept | Cancel
        e.stopPropagation()
        let payload = {
            "status": "rejected"
        }

        if (action === "Accept") {
            payload = {
                "status": "approved"
            }
        }

        mutate({ request_id, payload },
            {
                onSuccess: (res) => {
                    console.log("res", res);
                    queryClient.invalidateQueries({
                        queryKey: ['admin-client-plan-request'],
                        exact: false, // Match all ['items', *] queries
                    });
                },
                onError: (error) => { console.log("error", error) },
            }
        )
    }

    if (isPending) {
        return <Typography>Loading</Typography>
    }

    if (rows.length === 0) {
        return <Typography>No Request</Typography>
    }
    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{}}>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>type</strong></TableCell>
                            <TableCell><strong>Active</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                onClick={() => handleRowClick(row)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell>{row.client_pricing.name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.action_type === "renew" ? "Renew" : "Change"}</TableCell>
                                <TableCell >
                                    {
                                        row.status === 'pending' ?
                                            <Box style={{ display: "flex", gap: ".25rem" }}>
                                                <Button variant="contained" color={"success"} size="small"
                                                    onClick={(e) => handleRequestAction("Accept", row.id, e)}
                                                >
                                                    Accept
                                                </Button>
                                                <Button variant="contained" color={"error"} size="small"
                                                    onClick={(e) => handleRequestAction("Cancel", row.id, e)}
                                                >
                                                    Cancel
                                                </Button>
                                            </Box>
                                            :
                                            undefined
                                    }

                                    {
                                        row.status === 'rejected' ? <Typography>rejected</Typography> : undefined
                                    }
                                    {
                                        row.status === 'approved' ? <Typography>approved</Typography> : undefined
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer >

            <Dialog open={Boolean(selectedRow)} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>User Details</DialogTitle>
                <DialogContent dividers>
                    {selectedRow && (
                        <>
                            <Typography><strong>Name:</strong> {selectedRow.name}</Typography>
                            <Typography><strong>Email:</strong> {selectedRow.email}</Typography>
                            <Typography><strong>Time:</strong> {selectedRow.time}</Typography>
                            <Typography><strong>Status:</strong> {selectedRow.active ? "Active" : "Inactive"}</Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            <PaginationComponent
                currentPage={pageData.current_page}
                totalPages={pageData.last_page}
                onChange={(newPage) => setPage(newPage)}
            />
        </>
    );
}
