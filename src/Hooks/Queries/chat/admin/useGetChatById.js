import { useQuery } from "@tanstack/react-query"
import { useChatDataStore } from "../../../../store/zustand-store/user-chat-data-store";
import getMessagesAdminApi from "../../../../api/chat/admin/get.chat.message.admin.service";


const useGetChatByIdAdmin = (chat_id, options = {}) => {
    return useQuery({
        queryKey: ["messages", chat_id],
        queryFn: () => getMessagesAdminApi(chat_id),
        refetchInterval: 2000,
        onError: (error) => { },
        enabled: !!chat_id,
        ...options

    })
}

export default useGetChatByIdAdmin