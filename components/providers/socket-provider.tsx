"use client"
import { io as ClientIo } from "socket.io-client";
import { createContext, useContext, useEffect, useState } from "react";

type SocketContextType={
socket:any|null;
isConnected:boolean
}

const SockectContext=createContext<SocketContextType>({
    socket:null,
    isConnected:false
})

export const useSocket=()=>{
    return useContext(SockectContext)
}

export const SocketProvider=({children}:{children:React.ReactNode})=>{
  
const [socket,setSocket]=useState(null)
const [isConnected,setIsConnected]=useState(false)

useEffect(()=>{
    const socketInstance=new(ClientIo as any)(process.env.NEXT_PUBLIC_SITE_URL!,{
        path:"/api/socket/io",
        addTrailingSlash:false
    })
socketInstance.on("connect",()=>{
    setIsConnected(true)
})
socketInstance.on("disconnect",()=>{
    setIsConnected(false)
})
setSocket(socketInstance)
return()=>{
    socketInstance.disconnect()
}
},[])
return (
    <SockectContext.Provider value={{socket,isConnected}}>
{children}
    </SockectContext.Provider>
)  

}
