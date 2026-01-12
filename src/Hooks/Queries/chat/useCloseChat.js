import { useMutation, useQueryClient } from "@tanstack/react-query"

import sendMessageUserApi from "../../../api/chat/user/send.message.service"
import { useChatDataStore } from "../../../store/zustand-store/user-chat-data-store";
import closeChatApi from "../../../api/chat/close.chat.service";

const useCloseChat = () => {
    const setChatRoomId = useChatDataStore((state) => state.setChatRoomId);
    const { email } = useChatDataStore((state) => state.loggedData);
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ email, chat_id }) => closeChatApi(email, chat_id),
        onSuccess: (res) => {
            console.log("useSendMessage", res)
            // Refresh messages immediately after sending
            queryClient.invalidateQueries({ queryKey: ["messages"] })
        },
    })
}

export default useCloseChat