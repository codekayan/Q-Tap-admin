import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Typography,
    Collapse,
    Button,
    Chip,
    Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useClientGetPlanRequests } from "../../../../../../Hooks/Queries/clientDashBoard/plan/useClientGetPlanRequests"
import { useAuthStore } from "../../../../../../store/zustand-store/authStore"
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeletePlanRequest } from '../../../../../../Hooks/Queries/clientDashBoard/plan/actions/useDeletePlanRequest';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';



function PlanCard({ item }) {

    const token = useAuthStore(state => state.userData.token)
    const actionType = item?.action_type === 'renew' ? 'Renewal' : "Change"


    const name = item?.pricing?.name
    const planDetails = (item?.pricing)

    const status = item?.status

    const [showDetails, setShowDetails] = useState(false);
    const parsedFeature = JSON.parse(item.pricing.feature || '[]')

    const queryClient = useQueryClient();

    const { mutate, isPending } = useDeletePlanRequest()

    const onDelete = () => {
        mutate({ token, request_id: item?.id },
            {
                onSuccess: (res) => {
                    toast.success("delete success")
                    queryClient.invalidateQueries({ queryKey: ['client-current-plan-request'] });
                },
                onError: (error) => {
                    console.log(error)
                },
            }
        )
    }
    return (
        <Card sx={{ maxWidth: 400, boxShadow: 4, borderRadius: 2 }}>
            <CardHeader
                title={name}
                subheader={`Action: ${actionType}`}
                action={
                    <Chip
                        label={status}
                        color={status === "Active" ? "success" : "warning"}
                        size="small"
                    />
                }
            />

            <CardActions disableSpacing>
                <Button
                    onClick={() => setShowDetails(prev => !prev)}
                    endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                    {showDetails ? "Hide" : "Show"} Plan Details
                </Button>
                {/* Delete Button aligned to the right */}
                <Box ml="auto">
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDelete()}
                        disabled={isPending}
                    >
                        {isPending ? "Loading..." : "Delete"}
                    </Button>
                </Box>
            </CardActions>

            <Collapse in={showDetails} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography variant="body2"><strong>description :</strong> {planDetails.description}</Typography>
                    <Typography variant="body2"><strong>Monthly Price:</strong> {planDetails.monthly_price}</Typography>
                    <Typography variant="body2"><strong>Yearlye Price:</strong> {planDetails.yearly_price}</Typography>
                    <Typography variant="body2"><strong>Number of Orders:</strong> {planDetails.orders_limit}</Typography>
                    <Typography variant="body2"><strong>Feature:</strong> </Typography>
                    <ul style={{ paddingLeft: 16 }}>
                        {parsedFeature.map((item, index) => (
                            <li key={index}>
                                <Typography variant="body2">{item}</Typography>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Collapse>
        </Card>
    );
}





const PlanRequests = () => {

    const token = useAuthStore(state => state.userData.token)

    const { data, isPending } = useClientGetPlanRequests({ token })

    const currentRequests = data?.data?.requests?.data


    if (isPending) {
        return "loading"
    }

    return (
        <div>
            {
                currentRequests.map(item => {

                    return (
                        <PlanCard
                            key={item?.id}
                            item={item} />
                    )
                })
            }

        </div>
    )
}

export default PlanRequests