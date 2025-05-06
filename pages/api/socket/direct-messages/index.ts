import { currentProfilePages } from "@/lib/current-profile-pages";
import { channelModel, conversationModel, directMessageModel, memberModel, messageModel, serverModel } from "@/model/schema";

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
const {conversationId}= req.query

if(!profile){
    return res.status(401).json({error:"Not authorized"})
}
    if(!conversationId){
        return res.status(401).json({error:"Something is missing"})
    }
    if(!content){
        return res.status(401).json({error:"Something is missing"})
    }


const conversation=await conversationModel.findOne({
      _id:conversationId,                                                  
})

const member=conversation.userOneId===profile.id?conversation.userOneId:conversation.userTwoId


if(!conversation){
    return res.status(401).json({error:"Not found"})
}

    if(!member){
        return res.status(401).json({error:"Not found"})
    }

const directMessage=await directMessageModel.create({
    userId:profile.id,
    conversationId:conversationId,
    message:content,
    imageUrl:fileUrl
})
const message=await directMessageModel.findById(directMessage._id).populate("userId")

const channelKey=`chat:${conversationId}:messages`
res.socket.server.io.emit(channelKey,message)    
return res.status(200).json(message)
}catch(e){
    console.log(e)
    return res.status(500).json({error:e})
}

}