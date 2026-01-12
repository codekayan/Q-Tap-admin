import { create } from 'zustand';

export const usePlanPricingStore = create((set) => ({
    selectedPlan: null,
    billingCycle: null,
    paymentMethod: null,

    setSelectedPlan: (planId) => set({ selectedPlan: planId }),
    setBillingCycle: (cycle) => set({ billingCycle: cycle }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    reset: () =>
        set({
            selectedPlan: null,
            billingCycle: null,
            paymentMethod: null,
        }),
}));