"use client"

import { cn } from "@/lib/utils"
import { ShieldAlert, ShieldCheck } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import UserAvatar from "../user-avatar"

interface ServerMemberProps{
  memberRole:string,
  memberId:string,
  memberName:string,
  profilePic:string
}
const roleIcon={
  Member:null,
  Moderator:<ShieldCheck className="w-4 h-4 ml-2 text-indigo-500"/>,
  Admin:<ShieldAlert className="w-4 h-4 ml-2 text-rose-500"/>
}


export default function ServerMember({memberRole,memberId,memberName,profilePic}:ServerMemberProps) {
const params=useParams()
const router=useRouter()
//@ts-ignore
const icon=roleIcon[memberRole]
 const onClick=()=>{
  router.push(`/servers/${params?.serverId}/conversations/${memberId}`)
 }

  return (
  <button onClick={()=>onClick()} className={cn("group hover:rounded-sm px-2 py-2 flex w-full items-center gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
    params?.memberId===memberId && "bg-zinc-700/20 rounded-sm dark:bg-zinc-600/70"
  )}>
    <UserAvatar  className="w-8 h-8 " src={profilePic}/>
    <p className={cn("font-semibold text-xs text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
      params?.memberId===memberId && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
    )}>{memberName}</p>
    {icon}
  </button>
  )
}
