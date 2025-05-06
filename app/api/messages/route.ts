import { currentProfile } from "@/lib/current-profile"
import { memberModel, messageModel } from "@/model/schema"
import { NextResponse } from "next/server"

export async function GET(req:Request){
 try{
const profile=await currentProfile()
const {searchParams}=new URL(req.url)
const cursor=searchParams.get("cursor")
const channelId=searchParams.get("channelId")
const severId=searchParams.get("serverId")

const query={channelId:channelId}
if(!profile){
    return new NextResponse("Unauthorized",{status:401})
}if(!channelId){
    return new NextResponse("Missing ChannelId",{status:400})
}

if (cursor) {
  //@ts-ignore
    query._id = { $lt: cursor };
  }

  let messages: any[] = [];

  messages = await messageModel
    .find(query)
    .sort({ _id: -1 })
    .limit(10)
    .populate("userId");
  
  const serverId = severId; 
  
  const memberMap = await memberModel.find({
    serverId,
    userId: { $in: messages.map((msg) => msg.userId._id) }
  }).then((members) => {
    const map = new Map();
    members.forEach((member) => {
      map.set(member.userId.toString(), member.role);
    });
    return map;
  });
  

  const messagesWithRoles = messages.map((msg) => ({
    ...msg.toObject(),
    memberRole: memberMap.get(msg.userId._id.toString()) || "Member"
  }));
  


   const nextCursor = messages.length > 0 ? messages[messages.length - 1]._id : null;

   return NextResponse.json({
    items: messagesWithRoles,
    nextCursor,
  });
  
 }catch(e){
    console.log(e)
    return new NextResponse("Something HAppened",{status:500})
 }
}