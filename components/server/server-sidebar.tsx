import { currentProfile } from "@/lib/current-profile";
import { connectDB } from "@/lib/db";
import { channelModel, memberModel, serverModel } from "@/model/schema";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";
interface ServerSideBarProps {
  serverId: string;
}

const iconMap = {
  Text: <Hash className="mr-2 h-4 w-4" />,
  Voice: <Mic className="mr-2 h-4 w-4" />,
  Video: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  Member: null,
  Moderator: <ShieldCheck className="text-indigo-500 h-4 w-4 mr-2" />,
  Admin: <ShieldAlert className="text-indigo-500 h-4 w-4 mr-2" />,
};
export default async function ServerSideBar({ serverId }: ServerSideBarProps) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  await connectDB();
  const server = await serverModel.findById(serverId);

  const members = await memberModel.find({
    _id: { $in: server.memberId },
  }).populate("userId");
console.log(members)
  if (!server) {
    return redirect("/");
  }
  const plainServer = {
    id: server._id.toString(),
    name: server.name,
    imageUrl: server.imageUrl,
    inviteCode: server.inviteCode,
    memberId: server.memberId.toString(),
    creatorId: server.creatorId.toString(),
    createdAt: server.createdAt.toISOString(),
    updatedAt: server.updatedAt.toISOString(),
  };
  const currentUser = await members.find((member) =>
    member.userId.equals(new mongoose.Types.ObjectId(profile.id))
  );

  const data = await channelModel.find({
    serverId: server._id,
  });
  const textChannels = data.filter((channel) => channel.type === "Text");
  const audioChannels = data.filter((channel) => channel.type === "Voice");
  const videoChannels = data.filter((channel) => channel.type === "Video");

  return (
    <div className="w-full  h-full text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]   md:!flex flex-col">
      <ServerHeader server={plainServer} role={currentUser.role} />
      <ScrollArea className="flex-1 px-3 ">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.name,
                  icon: roleIconMap[member.type],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="Text"
              role={currentUser.role}
              label="Text channels"
            />
            <div className="space-y-2">
            {textChannels.map((channel)=>(
              <ServerChannel
              key={channel.id}
              role={currentUser.role}
              server={plainServer}
              channelType={channel.type}
              channelName={channel.name}
              channelId={channel.id}
              icon={iconMap[channel.type]}/>
            ))}</div>
          </div>
        )}{!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="Audio"
              role={currentUser.role}
              label="Audio channels"
            />
            <div className="space-y-2">
            {audioChannels.map((channel)=>(
              <ServerChannel
              key={channel.id}
              role={currentUser.role}
              server={plainServer}
              channelType={channel.type}
              channelName={channel.name}
              channelId={channel.id}
              icon={iconMap[channel.type]}/>
            ))}
          </div>
          </div>
        )}{!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType="Video"
              role={currentUser.role}
              label="Video channels"
            />
            <div className="space-y-2">
            {videoChannels.map((channel)=>(
              <ServerChannel
              key={channel.id}
              role={currentUser.role}
              server={plainServer}
              channelType={channel.type}
              channelName={channel.name}
              channelId={channel.id}
              icon={iconMap[channel.type]}/>
            ))}
          </div>
          </div>
        )}{!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              channelType="Video"
              role={currentUser.role}
              label="Members"
              server={plainServer}
            />
            {members.map((member)=>(
             <ServerMember
             key={member.id}
             server={plainServer}
             memberRole={member.role}
             memberId={member.id}
             profilePic={member.userId.imageUrl}
             memberName={member.userId.username}/>
            ))}
           </div>)}
      </ScrollArea>
    </div>
  );
}
