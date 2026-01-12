import React, { useState } from "react";
import { MoreVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { useTranslation } from "react-i18next";
import useCloseChat from "../../Hooks/Queries/chat/useCloseChat";

export default function ChatSettingMenu({ chat,  className = "" }) {
  const { t } = useTranslation();
  const {} = useCloseChat()
  const handleCloseChat = (v) => {
    
  };
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size="icon"
            aria-label="Open status menu"
            className="rounded-full bg-transparent p-1 hover:bg-gray-200"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-40 bg-white text-black border border-gray-200 shadow-lg rounded-md"
        >
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent chat row select
              handleCloseChat(chat);
            }}
            className="rounded-md hover:bg-gray-100 cursor-pointer"
            disabled={chat?.status === "closed"}
          >
            {t("chat.clearChat")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
