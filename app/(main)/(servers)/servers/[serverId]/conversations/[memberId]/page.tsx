import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { getOrCreateConvo } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { memberModel } from "@/model/schema";
import { redirect } from "next/navigation";
import React from "react";
interface MemberIdPageProps {
  params: any;
  searchParams:any
}
export default async function MemberIdPage({ params,searchParams }: MemberIdPageProps) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const currentMember = await memberModel
    .findOne({
      userId: profile.id,
      serverId: (await params).serverId,
    })
    .populate("userId");

  if ( !currentMember) {
    return redirect("/");
  }
  const conversationn = await getOrCreateConvo(currentMember._id,(await params).memberId);
  if (!conversationn) return redirect("/");

  const { memberOne, memberTwo,conversation } = conversationn;
  const otherMember = memberOne.userId === profile.id ? memberOne : memberTwo;
 

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      <ChatHeader
        imageUrl={otherMember.userId.imageUrl}
        serverId={(await params).serverId}
        name={otherMember.userId.username}
        type="conversation"
      />
      {!searchParams.video && (<>
      
        <div className="flex-1 overflow-y-auto">
      <ChatMessages 
      member={String(currentMember._id)}
      memberImage={currentMember.userId.imageUrl}
      memberName={currentMember.userId.username}
      memberRole={currentMember.role}
      chatId={String(conversation._id)}
      name={otherMember.userId.username}
      type="conversation"
      apiUrl="/api/direct-messages"
      socketUrl="/api/socket/direct-messages"
      socketQuery={{
        conversationId:conversation._id,
      }}
      paramKey="conversationId"
      paramValue={String(conversation._id)}
      /></div>
      <div className="sticky !bottom-0 bg-white dark:bg-[#313338] z-10"> 
             <ChatInput
              name={otherMember.userId.username}
              type="conversation"
              apiUrl="/api/socket/direct-messages"
              query={{
                conversationId:conversation._id
              }}
            />
   </div>
      </>)}
      {searchParams.video &&(
        <MediaRoom
        chatId={conversation._id}
        video={true}
        voice={true}/>
      )}
        
       </div>
  );
}
