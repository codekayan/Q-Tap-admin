import { createSlice } from "@reduxjs/toolkit";

// Initial state matching the context's personalData structure
const initialState = {
  personalData: {
    fullName: "",
    phone: "",
    email: "",
    month: "",
    day: "",
    year: "",
    country: "",
    password: "",
    confirmPassword: "",
    img: "",
    website: "",
    pricing_way: "",
    pricing_id: "",
    payment_method: "cash",
    discount_id: "",
  },
};

const personalSlice = createSlice({
  name: "personal",
  initialState,
  reducers: {
    updatePersonalData: (state, action) => {
      state.personalData = { ...state.personalData, ...action.payload };
    },
    clearPersonalData: (state) => {
      state.personalData = {
        fullName: "",
        phone: "",
        countryCode: "",
        email: "",
        month: "",
        day: "",
        year: "",
        country: "",
        password: "",
        confirmPassword: "",
        img: "",
        website: "",
        pricing_way: "",
        pricing_id: "",
        payment_method: "",
        discount_id: "",
      };
    },
    setPersonalData: (state, action) => {
      state.personalData = { ...state.personalData, ...action.payload };
    },
  },
});

// Export actions
export const { updatePersonalData, clearPersonalData, setPersonalData } = personalSlice.actions;

// Export reducer
export const personalReducer = personalSlice.reducer;

export const selectRegisterPersonalData = (state) => state?.registerPersonalDataStore.personalData;
