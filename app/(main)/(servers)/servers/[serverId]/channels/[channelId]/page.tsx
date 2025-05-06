import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MediaRoom from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { channelModel, memberModel } from "@/model/schema";
import { redirect } from "next/navigation";


export default async function ChannelIdPage({ params }: any) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  const channel = await channelModel.findOne({
    _id: (await params).channelId,
  });

  const member = await memberModel.findOne({
    serverId: (await params).serverId,
    userId: profile.id,
  }).populate("userId");
  const members = await memberModel.find({
    serverId: (await params).serverId,
  }).populate("userId");
  

  const channelName = channel.name;
  const channelId = channel._id;
  const serverId = (await params).serverId;
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
    <ChatHeader
      serverId={String(params.serverId)}
      type="channel"
      name={channelName}
    />
    <div className="!my-4"></div>
  {channel.type==="Text" &&(
    <>
    <div className="flex-1 overflow-y-auto">
      <ChatMessages
        member={String(member._id)}
        memberImage={member.userId.imageUrl}
        memberName={member.userId.username}
        memberRole={member.role}
        chatId={String(channel._id)}
        name={channelName}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: String(channel._id),
          serverId: String(params.serverId),
        }}
        paramKey="channelId"
        paramValue={String(channel._id)}
      />
    </div>
  

    <div className="sticky bottom-0 bg-white dark:bg-[#313338] z-10">
      <ChatInput
        name={channelName}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: String(channel._id),
          serverId: String(params.serverId),
        }}
      />
    </div>
    
    </>
  )}

 {channel.type==="Voice" &&(
  <MediaRoom
  chatId={channel._id}
  video={false}
  voice={true}
  
  />
 )}
 {channel.type==="Video" &&(
  <MediaRoom
  chatId={channel._id}
  video={true}
  voice={true}
  
  />
 )}
  </div>
  
  );
}
