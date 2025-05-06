import ServerSideBar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { memberModel, serverModel } from "@/model/schema";
import { redirect } from "next/navigation";
import React from "react";

export default async function ServerIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ serverId: string }>;
}) {
  const profile = await currentProfile();
  const { serverId } = await params;
  if (!profile) {
    return redirect("/");
  }

  const members = await memberModel.find({
    userId: profile.id,
  });

  const memberIds = members.map((m) => m._id);

  const server = await serverModel.findOne({
    _id: serverId,
    memberId: { $in: memberIds },
  });

  return <div className="h-full">
    <div className="hidden md:!flex fixed inset-y-0 z-20 h-full w-60 flex-col">
      <ServerSideBar serverId={(await params).serverId}/>
    </div> 
    <main className="h-full md:pl-60">
    {children}
    </main>
    </div>;
}
