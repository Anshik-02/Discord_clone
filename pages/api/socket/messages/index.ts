import { currentProfilePages } from "@/lib/current-profile-pages";
import { channelModel, memberModel, messageModel, serverModel } from "@/model/schema";

import {  NextApiRequest } from "next";

export default async function Handler(
    req:NextApiRequest,
    res:any
) {
if(req.method!=="POST"){
    return res.status(405).json({error:"Method not allowed"})
}
try{
const profile=await currentProfilePages(req)
const {content,fileUrl}= req.body
const {channelId,serverId}= req.query

if(!profile){
    return res.status(401).json({error:"Not authorized"})
}

if(!serverId&&channelId){
    return res.status(401).json({error:"Something is missing"})
}
if(!content){
    return res.status(401).json({error:"Something is missing"})
}

const server=await serverModel.findById(
    serverId
)

const channel=await channelModel.findOne({
      _id:channelId,
      serverId:serverId,                                                  
})

const member=await memberModel.findOne({
    userId:profile.id,
    serverId:serverId
})
console.log(member,channel,server)
if(!server){
    return res.status(401).json({error:"Not found"})
}
if(!channel){
    return res.status(401).json({error:"Not found"})
}
if(!member){
    return res.status(401).json({error:"Not found"})
}

const messages=await messageModel.create({
    userId:profile.id,
    channelId:channelId,
    message:content,
    imageUrl:fileUrl
})
const message=await messageModel.findById(messages._id).populate("userId")

const channelKey=`chat:${channelId}:messages`
res.socket.server.io.emit(channelKey,message)    
return res.status(200).json(message)
}catch(e){
    console.log(e)
    return res.status(500).json({error:e})
}

}