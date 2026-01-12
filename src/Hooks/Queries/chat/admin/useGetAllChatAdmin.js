import { useQuery } from "@tanstack/react-query"
import { useChatDataStore } from "../../../../store/zustand-store/user-chat-data-store";
import getChatRoomsAdminApi from "../../../../api/chat/admin/get.chat.rooms.admin.service";


const useGetAllChatAdmin = (status, options = {}) => {
    const resetChat = useChatDataStore((state) => state.reset);
    const chat_room_id = useChatDataStore((state) => state.chat_room_id);
    return useQuery({
        queryKey: ["admin-chat-rooms", status],
        queryFn: () => getChatRoomsAdminApi(status),
        refetchInterval: 2000,
        keepPreviousData: false,
        onError: (error) => { },
        ...options

    })
}

export default useGetAllChatAdmin