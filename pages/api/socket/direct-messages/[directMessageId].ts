import { currentProfilePages } from "@/lib/current-profile-pages";
import { conversationModel, directMessageModel, memberModel, messageModel, serverModel } from "@/model/schema";
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
const {directMessageId,conversationId}=req.query
const {message}=req.body

if(!profile){
    return res.status(401).json({error:"Something is missing"})
}
if(!conversationId){
    return res.status(401).json({error:"Something is missing"})
}
if(!directMessageId){
    return res.status(401).json({error:"Something is missing"})
}


const Message=await directMessageModel.findById(
    directMessageId
)


const messages=await directMessageModel.updateOne({
    _id:directMessageId,
},{message:message})



if(!Message||Message.deleted){
return res.status(404).json({error:"message not found"})
}

// const isMessageOwner=Message.userId===profile.id

if(req.method==="DELETE"){

const messages=await directMessageModel.updateOne({
    _id:directMessageId,
},{imageUrl:null,message:"This message has been deleted",deleted:true})
}

const Message1=await directMessageModel.findById(
    directMessageId
)

const updateKey=`chat:${conversationId}:message:update`
res.socket.server.io.emit(updateKey,Message1)



return res.status(200).json(Message1)

}catch(e){
    console.log(e)
    return res.status(500).json({error:"Internal Error"})
}




}