import { useMutation, useQueryClient } from "@tanstack/react-query"

import sendMessageUserApi from "../../../../api/chat/user/send.message.service"
import { useChatDataStore } from "../../../../store/zustand-store/user-chat-data-store";

const useSendMessage = () => {
    const setChatRoomId = useChatDataStore((state) => state.setChatRoomId);
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload) => sendMessageUserApi(payload),
        onSuccess: (res) => {
            console.log("useSendMessage", res)
            // Refresh messages immediately after sending
            queryClient.invalidateQueries({ queryKey: ["messages"] })
        },
    })
}

export default useSendMessage