import { Hash } from "lucide-react"
import MobileToggle from "../mobile-toggle"
import UserAvatar from "../user-avatar"
import SocketIndicator from "../socket-indicator"
import { ChatVideoComponent } from "../chat-video-component"

interface ChatHeaderProps{
    serverId:string,
    name:string,
    type:"channel"|"conversation"
    imageUrl?:string
}



export default function ChatHeader({serverId,name,type,imageUrl}:ChatHeaderProps) {
  return (
    <div className="text-md  bg-[#313338] z-1 font-semibold px-3  fixed top-0 !w-full flex items-center !h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
    <MobileToggle serverId={serverId}/>
    {type==="channel"&&(
        <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2"/>
    )}
    {type==="conversation"&&(
        <UserAvatar src={imageUrl} className="w-7 h-7 mr-2"/>
    )}
    <p className="font-semibold text-md text-black dark:text-white">
        {name}
    </p>
    <div className="flex items-center  md:relative md:!right-[310px] ml-auto">
    {type==="conversation" &&(
    <ChatVideoComponent/>
)}
<SocketIndicator/>
    </div>
        </div>
  )
}
