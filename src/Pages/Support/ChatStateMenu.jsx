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

export default function StatusMenu({
  value = "all",
  onChange,
  className = "",
}) {
  const { t } = useTranslation();

  const handleSelect = (v) => {
    onChange?.(v);
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            size="icon"
            aria-label="Open status menu"
            className="rounded-full p-1"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-40 bg-white text-black border border-gray-200 shadow-lg rounded-md"
        >
          <DropdownMenuItem
            onClick={() => handleSelect("all")}
            className={value === "all" ? "font-semibold" : ""}
          >
            {t("chat.all")}{" "}
            {value === "all" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSelect("pending")}
            className={value === "pending" ? "font-semibold" : ""}
          >
            {t("chat.pending")}{" "}
            {value === "pending" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleSelect("closed")}
            className={value === "closed" ? "font-semibold" : ""}
          >
            {t("chat.closed")}{" "}
            {value === "closed" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
