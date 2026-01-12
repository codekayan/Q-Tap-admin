import { ChevronLeft } from "lucide-react";
import { usePlanPricingStore } from "../../../../../../store/zustand-store/client-user-plan";
import PlanListItem from "./plan-list-item";
import { usePlanPricing } from "../../../../../../Hooks/Queries/clientDashBoard/plan/usePlanPricing";
import { useEffect } from "react";
import { Stack, Typography, Paper } from '@mui/material';

const PlanList = ({ data, handleNewPlanConfirmed }) => {
  const {
    selectedPlan,
    setSelectedPlan,
    billingCycle,
    reset
  } = usePlanPricingStore();


  const toggleSelect = (plan) => {
    if (selectedPlan) {
      if (plan.id === selectedPlan.id) {
        reset()
      }
      else {
        reset()
        setSelectedPlan(plan)
        console.log("select plan")
      }
    } else {
      setSelectedPlan(plan)
      console.log("select plan")

    }
  };

  return (
    // Inside your component
    <Stack spacing={2}>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        {data?.data?.data?.length ? (
          data.data.data.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <PlanListItem
                key={plan.id}
                plan={plan}
                isSelected={isSelected}
                onSelect={() => toggleSelect(plan)}
                handleNewPlanConfirmed={handleNewPlanConfirmed}
              />

            );
          })
        ) : (
          <Typography variant="body1">No plans available</Typography>
        )}
      </Paper>

    </Stack>
  )
  return (
    <>
      {/* <div className="back-button-icon" onClick={() => toggleChangePlane()}>
        <ChevronLeft size={"24px"} strokeWidth={2.25} />
      </div> */}
      <div className="plan-list">
        {
          data?.data?.data?.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <PlanListItem plan={plan}
                isSelected={isSelected}
                onSelect={() => toggleSelect(plan)}
                handleNewPlanConfirmed={handleNewPlanConfirmed}
              />
            )
          })
        }
      </div>
    </>
  )
}

export default PlanList