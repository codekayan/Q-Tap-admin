import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from  "../../utils/constants";



export const fetchMenuData = createAsyncThunk(
    'menu/fetchMenuData',
    async (branchNumber, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}menu/${branchNumber}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);
export const updataCategory = createAsyncThunk(
    'menu/updataCategory',
    async ({ id, newName, branch }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${BASE_URL}meals_categories/${id}`, {
                name: newName,
                brunch_id: branch
            },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);
export const deleteCategory = createAsyncThunk(
    'menu/deleteMenuData',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}meals_categories/${categoryId}`,  {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                }
            });

            return { ...response.data, categoryId };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);
export const addCategory = createAsyncThunk(
    'menu/deleteMenuData',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${BASE_URL}meals_categories/${categoryId}`,  {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('Token')}`,
                }
            });

            return { ...response.data, categoryId };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message);
            }
            return rejectWithValue('An unexpected error occurred');
        }
    }
);
const initialState = {
    data: [],
    loading: 'idle',
    status:'',
    error: null
}

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        addNewCat: (state, action) => {
            state.data.data = [...state.data.data, action.payload.data];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuData.fulfilled, (state, action) => {
                state.loading = false;
                state.status = 'success'
                state.data = action.payload;
            })
            .addCase(fetchMenuData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            /// cat name
            .addCase(updataCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updataCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updataCategory.fulfilled, (state, action) => {
                state.success = true;
                state.loading = false;
                const index = state.data.data.findIndex(
                    (cat) => cat.id === action.payload.data.id
                );
                if (index !== -1) {
                    state.data.data[index].name = action.payload.data.name;
                }
            })
            // cat delete
            .addCase(deleteCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.success = true;
                state.loading = false;
                state.data.data = state.data.data.filter(
                    (cat) => { return cat.id !== action.payload.categoryId }
                )
            });

    },
});

export default menuSlice.reducer;
export const {addNewCat} = menuSlice.actions
export const selectMenuData = (state) => state?.menu?.data;
export const selectMenuDataStatus = (state) => state.menu.status