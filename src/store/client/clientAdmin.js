import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import {BASE_URL} from  "../../utils/constants";



// Helper function to get the authorization header
const getAuthHeader = () => {
    const Token = localStorage.getItem('Token');
    return Token ? { 'Authorization': `Bearer ${Token}` } : {};
};

// Async Thunk for fetching area data using Axios with Authorization
export const fetchAreaData = createAsyncThunk(
    'data/fetchArea',
    async () => {
        try {
            const response = await axios.get(`${BASE_URL}area`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

// Async Thunk for fetching get_info data using Axios with Authorization
export const fetchGetInfoData = createAsyncThunk(
    'data/fetchGetInfo',
    async () => {
        try {
            const response = await axios.get(`${BASE_URL}get_info`, {
                headers: getAuthHeader(),
            });
            console.log(response.data ,":::::::get_info");
            
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

// Async Thunk for fetching tables data using Axios with Authorization
export const fetchTablesData = createAsyncThunk(
    'data/fetchTables',
    async () => {
        try {
            const response = await axios.get(`${BASE_URL}tables`, {
                headers: getAuthHeader(),
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
);

const dataSlice = createSlice({
    name: 'data',
    initialState: {
        area: {
            data: [],
            loading: 'idle',
            error: null,
        },
        info: {
            data: null,
            selectedBranch: null,
            loading: 'idle',
            error: null,
        },
        tables: {
            data: [],
            loading: 'idle',
            error: null,
        },
    },
    reducers: {
        createArea: (state, action) => {
            // Assuming action.payload is the new area object
            state.area.data.areas.push(action.payload);
        },
        deleteArea: (state, action) => {
            // Assuming action.payload is the ID of the area to delete
            state.area.data.areas = state.area.data.areas.filter(
                (area) => area.id !== action.payload
            );
        },
        updateArea: (state, action) => {
            // Assuming action.payload is the updated area object
            const index = state.area.data.areas.findIndex(
                (area) => area.id === action.payload.id
            );
            if (index !== -1) {
                state.area.data.tables[index] = action.payload;
            }
        },

        createTable: (state, action) => {
            // Assuming action.payload is the new area object
            state.tables.data.tables.push(action.payload);
        },
        deleteTable: (state, action) => {
            // Assuming action.payload is the ID of the area to delete
            state.tables.data.tables = state.tables.data.tables.filter(
                (area) => area.id !== action.payload
            );
        },
        updateTable: (state, action) => {
            // Assuming action.payload is the updated area object
            const index = state.tables.data.tables.findIndex(
                (area) => area.id === action.payload.id
            );
            if (index !== -1) {
                state.tables.data.tables[index] = action.payload;
            }
        },
        /**\
        ****\
        *  *| ==> info
        ** /
        */

        updateBranchMenu: (state, action) => {
            const branches = state.info.data?.qtap_clients?.brunchs;

            if (!Array.isArray(branches)) return;

            const index = branches.findIndex(branch => {
                return branch.id === action.payload?.id
            });
            if (index === -1) return;
            // Handle serving_ways specifically
            const updatedBranch = {
                ...action.payload,
            };
            branches[index] = updatedBranch
        },
        updateInfoOnly: (state, action) => {
            state.info.data.qtap_clients = action.payload.client_data;
        },
        updateSelectedBranch: (state, action) => {
            state.info.selectedBranch = action.payload
            localStorage.setItem("selectedBranch", action.payload)
        },
    },
    extraReducers: (builder) => {
        // Reducers for fetchAreaData
        builder.addCase(fetchAreaData.pending, (state) => {
            state.area.loading = 'loading';
        });
        builder.addCase(fetchAreaData.fulfilled, (state, action) => {
            state.area.loading = 'succeeded';
            state.area.data = action.payload;
        });
        builder.addCase(fetchAreaData.rejected, (state, action) => {
            state.area.loading = 'failed';
            state.area.error = action.error.message;
        });

        // Reducers for fetchGetInfoData
        builder.addCase(fetchGetInfoData.pending, (state) => {
            state.info.loading = 'loading';
        });
        builder.addCase(fetchGetInfoData.fulfilled, (state, action) => {
            state.info.loading = 'succeeded';
            state.info.data = action.payload;
            console.log("selected branch", action.payload.qtap_clients.brunchs?.[0].id) //debug log
            state.info.selectedBranch = action.payload.qtap_clients.brunchs?.[0].id

            localStorage.setItem("selectedBranch", action.payload.qtap_clients.brunchs?.[0].id)
        });
        builder.addCase(fetchGetInfoData.rejected, (state, action) => {
            state.info.loading = 'failed';
            state.info.error = action.error.message;
        });

        // Reducers for fetchTablesData
        builder.addCase(fetchTablesData.pending, (state) => {
            state.tables.loading = 'loading';
        });
        builder.addCase(fetchTablesData.fulfilled, (state, action) => {
            state.tables.loading = 'succeeded';
            state.tables.data = action.payload;
        });
        builder.addCase(fetchTablesData.rejected, (state, action) => {
            state.tables.loading = 'failed';
            state.tables.error = action.error.message;
        });
    },
});

// Export the async thunks and the reducer
export const { createArea, deleteArea, updateArea, createTable, deleteTable, updateTable, updateBranchMenu, updateInfoOnly ,updateSelectedBranch } = dataSlice.actions;
export default dataSlice.reducer;

/*\
*  \ 
****| AreaData
*  / 
\*/
export const selectAreaData = (state) => state.clientLogin.area.data;
export const selectAreaLoading = (state) => state.clientLogin.area.loading;
export const selectAreaError = (state) => state.clientLogin.area.error;

/*\
*  \ 
****| GetInfoData
*  / 
**/
export const selectGetInfoData = (state) => state.clientLogin.info.data;
export const selectGetInfoLoading = (state) => state.clientLogin.info.loading;
export const selectGetInfoError = (state) => state.clientLogin.info.error;
export const selectSelectedBranch = (state) => state.clientLogin.info.selectedBranch; //updateSelectedBranch
/*\
*  \ 
****| Branch
*  / 
**/
export const selectBranch = (index) => (state) => {
    return state.clientLogin?.info?.data?.qtap_clients?.brunchs?.[index] || null;
};
export const selectAllBranch = (index) => (state) => {
    return state.clientLogin?.info?.data?.qtap_clients?.brunchs ?? [];
}
export const selectBranchById = (branchId) => (state) => {
    return state.clientLogin?.info?.data?.qtap_clients?.brunchs?.find(
        (branch) => branch.id === branchId
    ) || null;
};
/*\
*  \ 
****| Tables
*  / 
**/
export const selectTablesData = (state) => state.clientLogin.tables.data;
export const selectTablesLoading = (state) => state.clientLogin.tables.loading;
export const selectTablesError = (state) => state.clientLogin.tables.error;
