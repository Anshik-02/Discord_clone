import { currentProfile } from "@/lib/current-profile";
import { connectDB } from "@/lib/db";
import { channelModel, serverModel } from "@/model/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return NextResponse.json("ServerId is required", { status: 401 });
    }
    if (name === "general") {
      return NextResponse.json("gerenal cant be a name", { status: 400 });
    }
    await connectDB()
    const channelId=await channelModel.create({
        name:name,
        type:type,
        userId:profile.id,
        serverId:serverId
    }) 
    console.log(channelId)
    const server=await serverModel.updateOne({_id:serverId},{$push:{channelId:channelId._id}})
    console.log(server)
    return NextResponse.json("Channel Created",{status:200})

  } catch (e) {
    console.log(e);
    return NextResponse.json("ERROR ND ALL", { status: 400 });
  }
}
