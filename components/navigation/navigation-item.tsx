"use client";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "../action-tooltip";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface NavigationItem {
  name: string;
  imageUrl: string;
  id: string;
}

export default function NavigationItem({ name, imageUrl, id }: NavigationItem) {
  const param = useParams();
const router=useRouter()
 const  onClick=()=>{
  router.push(`/servers/${id}`)
 } 

return (
  
      <ActionTooltip side="right" label={name} align="center">
        <button  onClick={onClick} className="group flex relative items-center mb-3  ">
          <div
            className={cn(
              "absolute left-0 w-[4px] transition-all rounded-r-full   bg-primary ",
              param?.serverId !== id && "group-hover:h-[20px]",
              param?.serverId === id ? "h-[36px]" : "h-[8px]"
            )}
          />
<div 
  className={cn(
    "relative group mx-3 h-[48px] w-[48px]  !space-y-5 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
    param?.serverId === id && "bg-primary/10 text-primary  rounded-[16px]"
  )}
>
  <Image
    src={imageUrl}
    alt="channel"
    fill
    className="object-cover "
    sizes="48px"
    priority
  />
</div>
        </button>
      </ActionTooltip>
    
  );
}
