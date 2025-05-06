"use client"
import { useSocket } from "./providers/socket-provider"
import { Badge } from "./ui/badge"

 

export default function SocketIndicator() {
  const {isConnected}=useSocket()
  if(!isConnected){
    return (
        <Badge variant="outline" className="bg-yellow-600 !z-[1000] text-white border-none">
            FallBack:Polling every 1s
        </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Live:Realtime Updates
    </Badge>
  
)
}
