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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/new-origin";
import axios from "axios";

export function InviteModel() {
  const { onOpen, isOpen, onClose, type, data } = useModel();
  const { server } = data;
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const origin = useOrigin();
  const router = useRouter();

  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
useEffect(() => {setIsMounted(true)},[])

if(!isMounted) return null;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onGenerate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      console.log(response.data);
      onOpen("invite", { server: response.data });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = () => {
  
    router.refresh()
    onClose();
  };


  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0 fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="uppercase text-zinc-500 dark:text-secondary/70 font-bold text-xs">
            Server invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input disabled={isLoading}
              className="!bg-zinc-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
              value={inviteUrl}
              onChange={(e) => {}}
            />
            <Button disabled={isLoading} size="icon" onClick={onCopy} className="cursor-pointer">
              {copied ? (
                <Check className="w-4 h-4 " />
              ) : (
                <Copy className="w-4 h-4 " />
              )}
            </Button>
          </div>
          <Button  disabled={isLoading} variant="link" className="text-xs text-zinc-500 mt-1 ">
            Generate new invite code
            <RefreshCw />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
