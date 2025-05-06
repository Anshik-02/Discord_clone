import { useSocket } from "@/components/providers/socket-provider"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"

type ChatSocketProp={
    addKey:string,
    updateKey:string,
    queryKey:string
}

export const useChatSocket = ({ addKey, updateKey, queryKey }: ChatSocketProp) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();
  
    useEffect(() => {
      if (!socket) return;
  
      socket.on(updateKey, (message: any) => {
        queryClient.setQueriesData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) return oldData;
  
          const newData = oldData.pages.map((page: any) => {
            return {
              ...page,
              items: page.items.map((item: any) =>
                item._id === message._id ? message : item
              ),
            };
          });
  
          return {
            ...oldData,
            pages: newData,
          };
        });
      });
  
      socket.on(addKey, (message: any) => {
        queryClient.setQueriesData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [message],
                },
              ],
            };
          }
  
          const newData = [...oldData.pages];
          newData[0] = {
            ...newData[0],
            items: [message, ...newData[0].items],
          };
  
          return {
            ...oldData,
            pages: newData,
          };
        });
      });

      return ()=>{socket.off(addKey)
        socket.off(updateKey)
      }
    }, [socket, addKey, updateKey, queryKey,updateKey,queryClient]);
  };
  