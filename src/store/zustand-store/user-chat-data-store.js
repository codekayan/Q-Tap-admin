import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

export const useChatDataStore = create(
    persist(
        (set) => ({
            isLogged: false,
            loggedData: {},
            chat_room_id: null,

            loggedIn: ({ name, email, phone, address }) => {
                set({
                    isLogged: true,
                    loggedData: { name, email, phone, address }, // ✅ fixed typo
                });
            },
            setChatRoomId: (id) => set({ chat_room_id: id }),
            reset: () => set({ isLogged: false, loggedData: {}, chat_room_id: null }),
        }),
        {
            name: "chat-data", // 🔑 key in localStorage
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
