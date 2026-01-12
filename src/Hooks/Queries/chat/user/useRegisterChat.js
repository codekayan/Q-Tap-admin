import { useMutation, useQueryClient } from "@tanstack/react-query"

import registerChatUserApi from "../../../../api/chat/user/register.chat.service"
import { useChatDataStore } from "../../../../store/zustand-store/user-chat-data-store";

const useRegisterChat = () => {
    const setChatRoomId = useChatDataStore((state) => state.setChatRoomId);
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload) => registerChatUserApi(payload),
        onSuccess: (res) => {
            // const data = {
            //   chat: {
            //     created_at: "2025-09-16T21:36:24.000000Z",
            //     email: "user@example.com",
            //     id: 4,
            //     name: "test",
            //     status: "pending",
            //     updated_at: "2025-09-16T21:36:24.000000Z",
            //   },
            //   message: {
            //     chat_id: 4,
            //     message: "aaaa",
            //     type: "user",
            //   },
            // };
            console.log(res)
            console.log(res?.data?.message?.chat_support_id)
            setChatRoomId(res?.data?.message?.chat_support_id);
            // Refresh messages immediately after sending
            queryClient.invalidateQueries({ queryKey: ["messages"] })
        },
    })
}

export default useRegisterChat