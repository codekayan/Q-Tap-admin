import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { usePlanPricingStore } from '../../../../../../store/zustand-store/client-user-plan'
// import '../../css/confirmNewPlanePage.css'

import {
    Box,
    IconButton,
    Typography,
    Button,
    CircularProgress,
    Stack,
    Card
} from "@mui/material";
import { useCreatePlanRequest } from '../../../../../../Hooks/Queries/clientDashBoard/plan/actions/useCreatePlanRequest';
import { useAuthStore } from '../../../../../../store/zustand-store/authStore';
import { toast } from 'react-toastify';

const ConfirmNewPlan = ({ handleBackToSelectPlan }) => {

    const {
        selectedPlan,
        billingCycle,
        paymentMethod,
        setPaymentMethod,
        reset,
    } = usePlanPricingStore()

    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const userData = useAuthStore(state => state.userData)
    const { mutate, isPending } = useCreatePlanRequest()

    const handleConfirm = () => {

        const payload = {
            action_type: "upgrade",
            pricing_way: billingCycle === "monthly" ? "monthly_price" : "yearly_price",
            payment_method: "cash",
            new_pricing_id: selectedPlan.id,
        }

        mutate({ payload, token: userData.token, user_id: userData.user.user_id },

            {
                onSuccess: (res) => {
                    toast.success("plan change successfully wait for admin approve")
                    handleCancel()
                },
                onError: (error) => {
                    console.log(error)
                    if (error?.response?.data?.existing_request_id && error?.response?.data?.success === false) {
                        toast.error(error?.response?.data?.message)

                        return;
                    }
                }
            }
        )
    };

    const handleCancel = () => {
        reset();
        handleBackToSelectPlan()
    };


    return (
        <Box>
            {/* Back button */}
            <IconButton onClick={handleBackToSelectPlan}>
                <ChevronLeft sx={{ fontSize: 24 }} />
            </IconButton>

            {/* Panel */}
            <Card
                sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 3,
                    mt: 2,
                    maxWidth: 400,
                    boxShadow: 2,
                    // backgroundColor: "#fafafa"
                }}
            >
                <Box mb={2}>
                    <Typography variant="h6">
                        {selectedPlan ? selectedPlan.name : "No plan selected"}
                    </Typography>
                    <Typography variant="body2" sx={{ my: 0.5 }}>
                        {billingCycle}
                    </Typography>
                    <Typography variant="body2" sx={{ my: 0.5 }}>
                        {billingCycle === "yearly"
                            ? `${selectedPlan?.yearly_price}$`
                            : `${selectedPlan?.monthly_price}$`}
                    </Typography>
                </Box>

                {error && (
                    <Typography variant="body2" color="error" mb={2}>
                        {error}
                    </Typography>
                )}

                {/* Buttons */}
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : "Cancel"}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} /> : "Confirm"}
                    </Button>
                </Stack>
            </Card>
        </Box>
    )
    return (
        <div>
            <div className="back-button-icon" onClick={() => handleBackToSelectPlan()}>
                <ChevronLeft size={"24px"} strokeWidth={2.25} />
            </div>
            <div className="checkout-panel">
                <div className="panel-content">
                    <p className="plan-name">{selectedPlan ? selectedPlan.name : 'No plan selected'}</p>
                    <p className="billing-cycle" style={{ margin: "2px" }} >{billingCycle}</p>
                    <p className="billing-cycle" style={{ margin: "2px" }} >{billingCycle === "yearly" ? selectedPlan?.yearly_price + "$" : selectedPlan?.monthly_price + "$"}</p>

                </div>
                <p className="p-0 m-0" style={{ color: "red" }}>{error || ""}</p>
                <div className="button-group">
                    <button onClick={handleCancel} className="btn cancel" disabled={loading}>{loading ? "Loading" : "Cancel"}</button>
                    <button onClick={handleConfirm} className="btn confirm" disabled={loading}>{loading ? "Loading" : "Confirm"}</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmNewPlan