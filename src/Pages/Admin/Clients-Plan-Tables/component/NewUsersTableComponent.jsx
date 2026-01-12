import { useQueryClient } from '@tanstack/react-query';
import { useGetNewUserActivePlanRequest } from "../../../../Hooks/Queries/admin/plan/useGetNewUserActivePlanRequest";
import PaginationComponent from "./PaginationComponent";
import { useActivePlanFirstTime } from "../../../../Hooks/Queries/admin/plan/actions/useActivePlanFirstTime";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography,
} from "@mui/material";
import { useState } from 'react';




const NewUsersTableComponent = ({ selectedStatus }) => {
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);

    const queryClient = useQueryClient()


    const { data, isPending } = useGetNewUserActivePlanRequest(page, selectedStatus)

    const { mutate, isPending: isActivatePending } = useActivePlanFirstTime()

    const pageData = data?.data?.subscriptions

    const NewUser = data?.data?.subscriptions?.data || []

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    const handleCloseDialog = () => {
        setSelectedRow(null);
    };


    const refetchAllData = (queryClient) => {
        queryClient.invalidateQueries({
            queryKey: ['admin-new-client-plan-active'],
            exact: false, // Match all ['items', *] queries
        });
    }

    const handleActiveClick = (request_id, e) => {
        e.stopPropagation()
        mutate({ request_id },
            {
                onSuccess: (res) => {
                    console.log(res);
                    refetchAllData(queryClient)
                },
                onError: (error) => { console.log(error) },
            }
        )
    }

    if (isPending) {
        return <Typography>Loading</Typography>
    }
    return (NewUser.length === 0 ?
        < Typography color="text.primary"> NO Data Found</Typography >
        :
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{}}>
                        <TableRow>
                            <TableCell><strong>Name</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Time</strong></TableCell>
                            <TableCell><strong>Active</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(NewUser).map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                                onClick={() => handleRowClick(row)}
                                sx={{ cursor: "pointer" }}
                            >
                                <TableCell>{row.client.name}</TableCell>
                                <TableCell>{row.client.email}</TableCell>
                                <TableCell>{row.updated_at}</TableCell>
                                <TableCell>

                                    {
                                        row.status !== 'pending' ?
                                            <span style={{ color: 'green', fontWeight: 'bold' }}>{row.status}</span>
                                            : undefined
                                    }
                                    {
                                        row.status === 'pending' ?

                                            <Button variant="contained"
                                                color={'warning'}
                                                // color={row.status === 'active' ? "success" : "error"}
                                                size="small"
                                                onClick={(e) => handleActiveClick(row.id, e)}
                                            >
                                                {row.status}
                                            </Button>
                                            : undefined
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
                            <Typography><strong>Name:</strong> {selectedRow.client.name}</Typography>
                            <Typography><strong>Email:</strong> {selectedRow.client.email}</Typography>
                            <Typography><strong>Time:</strong> {selectedRow.client.time}</Typography>
                            <Typography><strong>Status:</strong> {selectedRow.updated_at ? "Active" : "Inactive"}</Typography>
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
    )
}

export default NewUsersTableComponent