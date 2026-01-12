import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useChatDataStore } from "../../../../store/zustand-store/user-chat-data-store";
import sendMessageAdminApi from "../../../../api/chat/admin/send.message.admin.service";

const useSendMessageAdmin = () => {
    const setChatRoomId = useChatDataStore((state) => state.setChatRoomId);
    const { email } = useChatDataStore((state) => state.loggedData);
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ message, chat_id }) => sendMessageAdminApi(message, chat_id),
        onSuccess: (res) => {
            // Refresh messages immediately after sending
            queryClient.invalidateQueries({ queryKey: ["messages", res?.data?.message?.chat_id] })
        },
    })
}

export default useSendMessageAdmin