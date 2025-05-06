"use client";

import { Plus, Settings } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModel } from "@/hooks/use-model-store";

interface ServerSectionProps {
  label: string;
  server?: any;
  role?: "Member" | "Moderator" | "Admin";
  channelType?: "Text" | "Voice" | "Video";
  sectionType: "members" | "channels";
}

export default function ServerSection({
  label,
  server,
  role,
  channelType,
  sectionType,
}: ServerSectionProps) {

const {onOpen}=useModel()


  return (
    <div className=" flex justify-between py-2  items-center">
      <p className="text-zinc-500 text-xs uppercase font-semibold dark:text-zinc-400">
        {label}
      </p>
      {role != "Member" && sectionType === "channels" && (
        <ActionTooltip label="Create a channel" side="right" align="center">
          <button className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition">
            <Plus onClick={()=>onOpen("createChannel",{channelType})} className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role!="Member"&&sectionType==="members" &&(
        <ActionTooltip label="Manage Members" side="right" align="center">
        <button className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition">
          <Settings onClick={()=>onOpen("members",{server})} className="w-4 h-4" />
        </button>
      </ActionTooltip> 
      )}
    </div>
  );
}
