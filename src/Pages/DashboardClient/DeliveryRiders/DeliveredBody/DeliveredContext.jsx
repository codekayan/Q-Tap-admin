
import React, { createContext, useState } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOpen = (order) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedOrder(null);
    };

    return (
        <OrderContext.Provider value={{ open, selectedOrder, handleOpen, handleClose }} disableScrollLock>
            {children}
        </OrderContext.Provider>
    );
};
