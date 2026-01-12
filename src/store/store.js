import { configureStore } from "@reduxjs/toolkit"
import { affiliateReducer } from "./affiliateSlice"
import { adminReducer } from "./adminSlice"
import clientDashBoard from "./client/clientDashBoardSlice"
import clientInfo from "./client/clientAdmin"
import menu from "./client/menuSlice"
import DiscountMenu from "./client/DiscountMenuSlice"
import { personalReducer } from "./register/personalSlice"
import { businessReducer } from "./register/businessSlice"
import UserData from "./client/userSlic"
import DeliveryOrder from "./client/deliveryOrderSlic"

export const store = configureStore({
    reducer: {
        affiliates: affiliateReducer,
        admins: adminReducer,
        registerBranchStore: businessReducer,
        registerPersonalDataStore: personalReducer,
        /*         
        qtabClient 
        */
        clientDashBoard,            // client role : admin
        clientLogin: clientInfo,    // client role : admin ->> contain branches
        menu,                       // client role : admin
        DiscountMenu,               // client role : admin
        DeliveryOrder,              // client role : delivery
        UserData,                   // client login first time 
    }
}) 