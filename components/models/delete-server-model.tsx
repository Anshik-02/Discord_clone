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
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import axios from "axios";

export function DeleteServerModel() {
  const { onOpen,isOpen, onClose, type, data } = useModel();
  const { server } = data;
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading,setIsLoading]=useState(false)
  const router = useRouter();

  const isModalOpen = isOpen && type === "deleteServer";


  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

const onClick=async()=>{
  try{
setIsLoading(true)
await axios.delete(`/api/servers/${server.id}`)
onClose()
router.refresh()
router.push("/")
  }catch(e){
    console.log(e)
  }
}



  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0 fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 z-[100]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
           Delete Server
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-semibold text-indigo-500">{server?.name}</span>
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
