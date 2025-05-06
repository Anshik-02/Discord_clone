import { currentProfile } from "@/lib/current-profile"
import { channelModel, serverModel } from "@/model/schema"
import { NextResponse } from "next/server"

export async function DELETE(req:Request,{params}:{params:{channelId:string}}) {
    try{
const profile=await currentProfile()
const {searchParams}=new URL(req.url)
const serverId=searchParams.get("serverId")

if(!profile){
return new NextResponse("Unauthorized",{status:401})

}
const server=await serverModel.updateOne({
    _id:serverId
},{$pull:{channelId:(await params).channelId}})
const channel=await channelModel.deleteOne({
    _id:(await params).channelId
})

return new NextResponse("hehe",{status:200})
    }catch(e){
console.log(e)
return new NextResponse("SOMETHING HAPPENDED",{status:500})
    }
}




export async function PATCH(req:Request,{params}:{params:{channelId:string}}) {
    try{
const profile=await currentProfile()
const {searchParams}=new URL(req.url)
const serverId=searchParams.get("serverId")
const {name ,type}=await req.json()
if(!profile){
return new NextResponse("Unauthorized",{status:401})
}

const channel=await channelModel.updateOne({
    _id:(await params).channelId
},{name:name,type:type})



return new NextResponse("hehe",{status:200})
    }catch(e){
console.log(e)
return new NextResponse("SOMETHING HAPPENDED",{status:500})
    }
}