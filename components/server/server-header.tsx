"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users
} from "lucide-react";
import { useModel } from "@/hooks/use-model-store";

export default function ServerHeader({
  server,
  role,
}: {
  server: any;
  role: string;
}) {
  const { onOpen } = useModel();
  const [open, setOpen] = useState(false);

  const isAdmin = role === "Admin";
  const isModerator = isAdmin || role === "Moderator";

  const handleClick = (type: string) => {
    setOpen(false);
    //@ts-ignore
    setTimeout(() => onOpen(type, { server }), 0);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="w-full font-semibold px-3 flex items-center border-neutral-200 h-12 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all focus:outline-none"
        >
          {server.name}
          <ChevronDown className="ml-auto w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-sx font-medium text-black bg-[#313338] rounded-xl z-[100] dark:text-neutral-400 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => handleClick("invite")}
            className="text-indigo-600 dark:text-indigo-400 cursor-pointer px-3 py-2 text-sm"
          >
            Invite People
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => handleClick("editServer")}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Server Settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => handleClick("members")}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Manage Members
            <Users className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => handleClick("createChannel")}
            className="cursor-pointer px-3 py-2 text-sm"
          >
            Create A Channel
            <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => handleClick("deleteServer")}
            className="text-rose-500 cursor-pointer px-3 py-2 text-sm"
          >
            Delete Server
            <Trash className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => handleClick("leaveServer")}
            className="text-rose-500 cursor-pointer px-3 py-2 text-sm"
          >
            Leave The Server
            <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
