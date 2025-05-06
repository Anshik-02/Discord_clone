"use client"
import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModel } from "@/hooks/use-model-store";


export default function NavigationAction() {
  const {onOpen}=useModel()
  return (
    <div>
      <ActionTooltip side={"right"} align="center" label="add a server">
      <button onClick={()=>onOpen("createServer")} className="group cursor-pointer flex items-center">
        <div className="flex  dark:group-hover:bg-emerald-500  dark:bg-neutral-700 w-[48px] items-center justify-center overflow-hidden transition-all  h-[48px] rounded-[24px] hover:rounded-[16px] ">
            <Plus
            size={25}
            className="group-hover:text-white  text-emerald-500 transition"/>
        </div>
      </button>
      </ActionTooltip>
    </div>
  );
}
