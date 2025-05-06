"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useModel } from "@/hooks/use-model-store";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import qs from "query-string"
import axios from "axios";

export function DeleteMessageModel() {
  const { isOpen, onClose, type, data } = useModel();
  const { apiUrl,query } = data;
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading,setIsLoading]=useState(false)
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteMessage";


  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

const onClick=async()=>{
  try{
  const url=qs.stringifyUrl({
    url:apiUrl||"",
    query:query
  })  
setIsLoading(true)
await axios.delete(url)
onClose()


  }catch(e){
    console.log(e)
  }
}



  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0 fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 z-[100]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
           Delete Message
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this message
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-10 justify-between py-4 ">
<div className="w-full flex items-center justify-between">
<Button disabled={isLoading} onClick={onClose} variant="ghost">Cancel</Button>
<Button disabled={isLoading} onClick={onClick} variant="primary">Confirm</Button>
</div>
        </DialogFooter>
       
      </DialogContent>
    </Dialog>
  );
}
