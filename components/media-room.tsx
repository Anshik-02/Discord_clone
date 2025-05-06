"use client"

import { useUser } from "@clerk/nextjs"
import "@livekit/components-styles"
import {LiveKitRoom,VideoConference} from "@livekit/components-react"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"


interface MediaRoomProps{
    chatId:string,
    video:boolean,
    voice:boolean
}

export default function MediaRoom({chatId,video,voice}:MediaRoomProps) {
  const {user}=useUser()
  const [token,setToken]=useState("")
  
  useEffect(()=>{
if(!user?.firstName)return
const name = String(user?.firstName ?? "");
//@ts-ignore


(async()=>{ 
    try{
const res=await fetch(`/api/livekit?room=${chatId}&username=${name}`)
const data=await res.json()
setToken(data.token)
    }catch(e){
console.log(e)
    }
})()

  },[user?.firstName,chatId])
  

  if(token===""){
    return (
        <div className="flex flex-col flex-1 justify-center items-center">
            <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4"/>
        </div>
    )    
  }
  
    return (
   <LiveKitRoom
   data-lk-theme="default"
   token={token}
   connect={true}
   video={video}
   audio={voice}
   serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}>
    <VideoConference/>
   </LiveKitRoom>
  )
}
