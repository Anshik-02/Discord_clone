import { currentProfile } from "@/lib/current-profile"
import {  channelModel, memberModel, profileModel, serverModel } from "@/model/schema"
import { NextResponse } from "next/server"
import {v4 as uuidv4} from "uuid"

export async function POST(req:Request) {
    
try{
const {name,imageUrl}=await req.json()

const profile=await currentProfile()

const server=await serverModel.create({
    name:name,
    imageUrl:imageUrl,
    inviteCode:uuidv4(),
    creatorId:profile.id,
    member:[]
})
const serverId=await profileModel.updateOne(
    {_id:profile.id},
{$set:{servers:[server._id]}})


const member=await memberModel.create({
    role:"Admin",
    userId:profile.id,
    serverId:server._id
})
 server.memberId.push(member._id)
await server.save()

const channel=await channelModel.create({
    name:"general",
    type:"Text",
    userId:profile.id,
    serverId:server._id
})
server.channelId.push(channel._id)
await server.save()
return new NextResponse(server,{status:200})
}

catch(error){
console.log("Something bad happende",error)
return new NextResponse("ERROR ND ALL",{status:500})
}
}