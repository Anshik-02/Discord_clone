"use client";

import { cn } from "@/lib/utils";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModel } from "@/hooks/use-model-store";

interface ServerChannelProps {
  role?: "Member" | "Moderator" | "Admin";
  server: any;
  channelType: string;
  channelName: string;
  channelId: string;
  icon: any;
}
const iconMap = {
  Text: <Hash className="mr-2 h-4 w-4" />,
  Voice: <Mic className="mr-2 h-4 w-4" />,
  Video: <Video className="mr-2 h-4 w-4" />,
};

export default function ServerChannel({
  channelType,
  channelName,
  channelId,
  server,
  role,
  icon,
}: ServerChannelProps) {
  const {onOpen}=useModel()
  const router = useRouter();
  const params = useParams();

  const onClick=()=>{
    router.push(`/servers/${params.serverId}/channels/${channelId}`)
  }
const onAction=(e:React.MouseEvent,action:ModalType)=>{
  e.stopPropagation()
  onOpen(action,{channelId,channelName,channelType,server})
}

  return (
    <button onClick={()=>onClick()}
      className={cn(
        "group cursor-pointer px-2 py-2 flex items-center gap-x-2 hover:bg-zinc-700/10 hover:rounded-sm dark:hover:bg-zinc-700/50 w-full transition mb-1",
        params?.channelId === channelId && "bg-zinc-700/70 dark:bg-zinc-700 rounded-sm"
      )}
    >
      {icon}
      <p
        className={cn(
          "line-clamp-1 font-semibold text-xs hover:rounded-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.channelId === channelId &&
            "text-primary dark:text-zinc-200 rounded-sm dark:group-hover:text-white"
        )}
      >
        {channelName}
      </p>
      {channelName !== "general" && role != "Guest" && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit" side="top">
            <Edit onClick={(e)=>{onAction(e,"editChannel")}} className="w-4 h-4 hidden group-hover:block text-zinc-500 dark:text-zinc-400 hover:text-zinc-300 hover:dark:text-zinc-300 transition" />
          </ActionTooltip>
          <ActionTooltip label="Delete"  side="top">
            <Trash onClick={(e)=>{onAction(e,"deleteChannel")}} className="w-4 h-4 hidden group-hover:block text-zinc-500 dark:text-zinc-400 hover:text-zinc-300 hover:dark:text-zinc-300 transition" />
          </ActionTooltip>
        </div>
      )}
 {channelName === "general"  && (
        <div className="ml-auto flex items-center gap-x-2">
          
            <Lock className="w-4 h-4 group-hover:block text-zinc-500 dark:text-zinc-400 hover:text-zinc-300 hover:dark:text-zinc-300 transition" />
          
          
        </div>
      )}

    </button>
  );
}
