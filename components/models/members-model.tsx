"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModel } from "@/hooks/use-model-store";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  Check,
  Gavel,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { MemberRole } from "@/model/schema";
import qs from "query-string"
import axios from "axios";
import { useRouter } from "next/navigation";

export function MembersModel() {
  const { onOpen, isOpen, onClose, type, data } = useModel();
  const { server } = data;
  const [isMounted, setIsMounted] = useState(false);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState("");
  const isModalOpen = isOpen && type === "members";
  

const router=useRouter()
  const roleIconMap = {
    Member: null,
    Moderator: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
    Admin: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
  };
  useEffect(() => {
    setIsMounted(true);
    const fetchMembers = async () => {
      if (!server?.memberId) return;
      const ids = server.memberId.split(",");

      try {
        const res = await fetch("/api/members", {
          method: "POST",
          body: JSON.stringify({ memberIds: ids }),
        });
        const data = await res.json();
        setMembers(data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, [server]);
  if (!isMounted) return null;



const onRoleChange=async(memberId:string,role:MemberRole)=>{
 try{
const url=qs.stringifyUrl({
  url:`/api/members/${memberId}`,
  query:{
    serverId:server?.id,
    memberId  
  }
})


const response=await axios.patch(url,{role})
router.refresh()

const Server=await response.data
onClose()
const plainServer = {
  id: Server._id.toString(),
  name: Server.name,
  imageUrl: Server.imageUrl,
  inviteCode: Server.inviteCode,
  memberId: Server.memberId.toString(),
  creatorId: Server.creatorId.toString(),
  createdAt: Server.createdAt.toISOString(),
  updatedAt: Server.updatedAt.toISOString(),
};


onOpen("members",{server:plainServer})
router.refresh()
 }catch(e){
  console.log(e)
 }
}

const onKick=async(memberId:string)=>{
  try{
    const url=qs.stringifyUrl({
      url:`/api/members/${memberId}`,
      query:{
        serverId:server?.id,
      }
    })

const response=await axios.delete(url)
router.refresh()
const Server=await response.data
onClose()
  }catch(e){
    console.log(e)
  }
}


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black   fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 z-[100]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-center">
          { server?.memberId.split(",").length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[420px] mt-8 pr-6 relative overflow-visible">
          {members.map((mem, key) => (
            <div key={key} className="flex items-center gap-x-2 mb-6">
              {" "}
              <UserAvatar src={mem?.user.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center">
                  {mem.user.username}

                  {roleIconMap[mem.role]}
                </div>
                <p className="text-xs text-zinc-500">{mem.user.email}</p>
              </div>
              {server.creatorId !== mem.user.id && (
                <div className="ml-auto">
                  <DropdownMenu >
                    <DropdownMenuTrigger>
                      <MoreVertical className="w-4 h-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right"  className="bg-[white] rounded-xl z-[1000]"  >
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="flex items-center !z-[10000]">
                          <ShieldQuestion className="w-4 h-4 mr-2" />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem onClick={()=>onRoleChange(mem._id,"Member")}>
                              <Shield className="w-4 mr-2 h-2" />
                              Member
                              {mem.role === "Member" && (
                                <Check className="ml-auto w-4 h-4" />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>onRoleChange(mem._id,"Moderator")}>
                              <ShieldCheck className="w-4 mr-2 h-2" />
                              Moderator   
                              {mem.role === "Moderator" && (
                                <Check className="ml-auto w-4 h-4" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator className="bg-zinc-200 mx-2 text-center"/>
                      <DropdownMenuItem onClick={()=>onKick(mem._id)}>
                        <Gavel className="h-4 w-4 m-2"/>
                        <span>Kick</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
