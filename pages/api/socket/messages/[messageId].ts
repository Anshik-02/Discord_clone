import { currentProfilePages } from "@/lib/current-profile-pages";
import { memberModel, messageModel, serverModel } from "@/model/schema";
import { NextApiRequest } from "next";

 

export default async function handler(
    req:NextApiRequest,
    res:any
){
if(req.method!=="DELETE" && req.method!=="PATCH"){
return res.status(405).json({error:"Method not allowed"})
}
try{
const profile=await currentProfilePages(req)
const {messageId,serverId,channelId}=req.query
const {message}=req.body

if(!profile){
    return res.status(401).json({error:"Something is missing"})
}
if(!serverId){
    return res.status(401).json({error:"Something is missing"})
}
if(!channelId){
    return res.status(401).json({error:"Something is missing"})
}


const Message=await messageModel.findById(
    messageId
)


const messages=await messageModel.updateOne({
    _id:messageId,
    channelId:channelId
},{message:message})



if(!Message||Message.deleted){
return res.status(404).json({error:"message not found"})
}

const isMessageOwner=Message.userId===profile.id

if(req.method==="DELETE"){

const messages=await messageModel.updateOne({
    _id:messageId,
    channelId:channelId
},{imageUrl:null,message:"This message has been deleted",deleted:true})
}

const Message1=await messageModel.findById(
    messageId
)

const updateKey=`chat:${channelId}:message:update`
res.socket.server.io.emit(updateKey,Message1)



return res.status(200).json(Message1)

}catch(e){
    console.log(e)
    return res.status(500).json({error:"Internal Error"})
}




}