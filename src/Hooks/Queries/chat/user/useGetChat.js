import { useQuery } from "@tanstack/react-query"
import getMessagesUserApi from "../../../../api/chat/user/get.chat.messages.service"
import { useChatDataStore } from "../../../../store/zustand-store/user-chat-data-store";

const useGetChat = (email, options = {}) => {
    const resetChat = useChatDataStore((state) => state.reset);
    const chat_room_id = useChatDataStore((state) => state.chat_room_id);
    return useQuery({
        queryKey: ["messages"],
        queryFn: () => getMessagesUserApi(email),
        refetchInterval: 2000,
        onError: (error) => {
            if (error?.response?.status === 404) {
                resetChat(); // 🔄 clear storage + Zustand store
            }
        },
        enabled: chat_room_id !== null,
        ...options

    })
}

export default useGetChat