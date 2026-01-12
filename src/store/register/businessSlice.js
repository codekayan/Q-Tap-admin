import { createSlice } from "@reduxjs/toolkit";

// Initial state matching the context's businessData, branches, and selectedBranch
const initialState = {
  businessData: {
    businessName: "",
    website: "",
    businessEmail: "",
    businessPhone: "",
    pin: "",
    country: "",
    city: "",
    mode: "white",
    design: "grid",
    format: "",
    currency: "",
    workschedules: {
      Saturday: ["9:00 am", "7:00 pm"],
      Sunday: ["9:00 am", "7:00 pm"],
    },
    callWaiter: "inactive",
    paymentTime: "after",
    tableCount: "",
    paymentMethods: [],
    servingWays: [],
    latitude: "",
    longitude: "",
  },
  branches: [],
  selectedBranch: null,
};

const businessSlice = createSlice({
  name: "business",
  initialState,
  reducers: {
    updateBusinessData: (state, action) => {
      console.log("inside updateBusinessData ", state.selectedBranch  )
      if (state.selectedBranch !== null && state.branches[state.selectedBranch]) {
        console.log("inside updateBusinessData if ", state.selectedBranch  )
        const updatedBranches = [...state.branches];
        updatedBranches[state.selectedBranch] = {
          ...updatedBranches[state.selectedBranch],
          ...action.payload,
        };
        state.branches = updatedBranches;
      } else {
        console.log("inside updateBusinessData else ", action.payload  )
        state.businessData = { ...state.businessData, ...action.payload };
      }
    },
    updateBusinessDataByIndex: (state, action) => {
      const { index, ...updatedData } = action.payload;
      if (state.branches?.[index]) {
        const updatedBranches = [...state.branches];
        updatedBranches[index] = {
          ...updatedBranches[index],
          ...updatedData,
        };
        state.branches = updatedBranches;
      } else {
        // fallback to updating businessData if no branches or index is invalid
        state.businessData = { ...state.businessData, ...updatedData };
      }
    },
    addBranch: (state) => {
      const newBranch = { ...state.businessData };
      state.branches = [...state.branches, newBranch];
      // Clear businessData after adding branch
      state.businessData = {
        businessName: "",
        website: "",
        businessEmail: "",
        businessPhone: "",
        country: "",
        city: "",
        mode: "white",
        design: "grid",
        format: "",
        currency: "",
        workschedules: {
          Saturday: ["9:00 am", "7:00 pm"],
          Sunday: ["9:00 am", "7:00 pm"],
        },
        callWaiter: "inactive",
        paymentTime: "after",
        tableCount: "",
        paymentMethods: [],
        servingWays: [],
        latitude: "",
        longitude: "",
      };
      state.selectedBranch = null;
    },
    selectBranch: (state, action) => {
      const index = action.payload;
      state.selectedBranch = index;
      if (state.branches[index]) {
        state.businessData = { ...state.branches[index] };
      }
    },
    clearBusinessData: (state) => {
      state.businessData = {
        businessName: "",
        website: "",
        pin: "",
        businessEmail: "",
        businessPhone: "",
        country: "",
        city: "",
        mode: "white",
        design: "grid",
        format: "",
        currency: "",
        workschedules: {
          Saturday: ["9:00 am", "7:00 pm"],
          Sunday: ["9:00 am", "7:00 pm"],
        },
        callWaiter: "inactive",
        paymentTime: "after",
        tableCount: "",
        paymentMethods: [],
        servingWays: [],
        latitude: "",
        longitude: "",
      };
      state.selectedBranch = null;
    },
    setBranches: (state, action) => {
      state.branches = action.payload;
    },
    reset: (state, action) => {
      state.businessData = initialState.businessData
      state.branches = initialState.branches
      state.selectedBranch = initialState.selectedBranch
    }
  },
});

// Export actions
export const {
  updateBusinessData,
  updateBusinessDataByIndex,
  addBranch,
  selectBranch,
  clearBusinessData,
  setBranches,
  reset,
} = businessSlice.actions;

// Export reducer
export const businessReducer = businessSlice.reducer;