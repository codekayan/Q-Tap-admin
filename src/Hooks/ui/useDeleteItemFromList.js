import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";


export const useDeleteItemFromList = ({ deleteApiFn, queryName }) => {

    const [deletingIds, setDeletingIds] = useState([]);

    const queryClient = useQueryClient();

    const handleDeleteItem = async (id) => {

        setDeletingIds((prev) => [...prev, id]);

        try {

            const response = await deleteApiFn(id)

            queryClient.invalidateQueries([queryName]);

            toast.success("delete success")
        } catch (error) {
            console.log(error)
            toast.error("delete faild")
        } finally {

            setDeletingIds((prev) => prev.filter((itemId) => itemId !== id));

        }

    }
    const isItemDeleting = (id) => {
        return deletingIds.includes(id)
    }

    return { isItemDeleting, handleDeleteItem }
}