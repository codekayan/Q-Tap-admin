import { ChevronDown, ChevronRight } from "lucide-react";
import { usePlanPricingStore } from "../../../../../../store/zustand-store/client-user-plan";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Box,
  Chip,
  Stack
} from "@mui/material";
// import { ChevronRight, ExpandMore } from "@mui/icons-material";
import { ChevronRight as MuiChevronRight, ExpandMore } from "@mui/icons-material";

const PlanListItem = ({ plan, onSelect, handleNewPlanConfirmed }) => {

  const features = JSON.parse(plan.feature || '[]');

  const {
    selectedPlan,
    billingCycle,
    setBillingCycle,

  } = usePlanPricingStore();

  const handleSelectPlanPayWay = (way) => {
    setBillingCycle(way)
  }
  const handleDeSelect = () => {
    onSelect()
  }
  const isSelected = selectedPlan?.id === plan.id;
  return (
    <Card
      key={plan.id}
      variant="outlined"
      sx={{
        mb: 2,
        borderColor: isSelected ? "primary.main" : "grey.300",
        backgroundColor: isSelected ? "primary.lighter" : "background.paper",
        // cursor: "pointer",
        transition: "0.3s",
      }}
    >
      <CardContent>
        <Box onClick={handleDeSelect} display="flex" justifyContent="space-between" alignItems="center" 
        style={{ cursor: 'pointer' }}
        >
          <Box>
            <Typography variant="h6">{plan.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {plan.description}
            </Typography>
          </Box>
          {isSelected ? (
            <ExpandMore fontSize="small" />
          ) : (
            <ChevronRight fontSize="small" />
          )}
        </Box>

        <Collapse in={isSelected} timeout="auto" unmountOnExit>
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              Features:
            </Typography>
            <ul style={{ paddingLeft: 20, marginTop: 0 }}>
              {features.map((f, i) => (
                <li key={i}>
                  <Typography variant="body2">✅ {f}</Typography>
                </li>
              ))}
            </ul>

            <Box mt={2}>
              <Typography variant="body2">
                <strong>Status:</strong> {plan.is_active ? "Active" : "Inactive"}
              </Typography>
              <Typography variant="body2">
                <strong>Orders Limit:</strong> {plan.orders_limit}
              </Typography>
              <Typography variant="body2">
                <strong>Monthly Price:</strong> ${parseFloat(plan.monthly_price).toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Yearly Price:</strong> ${parseFloat(plan.yearly_price).toFixed(2)}
              </Typography>
            </Box>

            <Box mt={2} display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Stack direction="row" spacing={1}>
                <Button
                  variant={billingCycle === "monthly" ? "contained" : "outlined"}
                  onClick={() => handleSelectPlanPayWay("monthly")}
                >
                  Monthly
                </Button>
                <Button
                  variant={billingCycle === "yearly" ? "contained" : "outlined"}
                  onClick={() => handleSelectPlanPayWay("yearly")}
                >
                  Yearly
                </Button>
              </Stack>

              {billingCycle && (
                <Button variant="contained" color="primary" onClick={handleNewPlanConfirmed}>
                  Confirm
                </Button>
              )}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
  return (
    <div key={plan.id} className={`plan-list-item ${isSelected ? "selected" : ""}`}>
      <div onClick={handleDeSelect} className="flex flex-space-between flex-align-items">
        <div>
          <p className="plan-custom-heading-name p-0 m-0">{plan.name}</p>
          <p className="p-0 m-0">{plan.description}</p>
          {isSelected && (
            <div className="plan-custom-details">
              <ul className="dialog-features">
                {features.map((f, i) => (
                  <li key={i}>✅ {f}</li>
                ))}
              </ul>
              <div className="dialog-info">
                <p><strong>Status:</strong> {plan.is_active}</p>
                <p><strong>Orders Limit:</strong> {plan.orders_limit}</p>
                <p><strong>Monthly Price:</strong> ${parseFloat(plan.monthly_price).toFixed(2)}</p>
                <p><strong>Yearly Price:</strong> ${parseFloat(plan.yearly_price).toFixed(2)}</p>
              </div>
            </div>
          )}

        </div>
        {isSelected ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </div>
      {
        isSelected && <div className="flex-space-between ">
          <div className="flex">
            <button className={`${billingCycle === "monthly" ? "main-button" : "secondary-button"}`}
              onClick={() => handleSelectPlanPayWay("monthly")}>monthly</button>
            <button className={`${billingCycle === "yearly" ? "main-button" : "secondary-button"}`}
              onClick={() => handleSelectPlanPayWay("yearly")}>yearly</button>
          </div>

          {billingCycle &&
            <button className={"main-button"}
              onClick={() => handleNewPlanConfirmed()}
            >
              confirm
            </button>
          }
        </div>
      }
    </div>

  )
}
export default PlanListItem