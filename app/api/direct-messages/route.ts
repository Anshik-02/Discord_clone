import { currentProfile } from "@/lib/current-profile"
import { directMessageModel } from "@/model/schema"
import { NextResponse } from "next/server"

export async function GET(req:Request){
 try{
const profile=await currentProfile()
const {searchParams}=new URL(req.url)
const cursor=searchParams.get("cursor")
const conversationId=searchParams.get("conversationId")

const query={conversationId:conversationId}
if(!profile){
    return new NextResponse("Unauthorized",{status:401})
}if(!conversationId){
    return new NextResponse("Missing conversationId",{status:400})
}

if (cursor) {
//@ts-ignore
    query._id = { $lt: cursor }; 
  }

let messages:any[]=[]

   messages=await directMessageModel
   .find(query) 
   .sort({ _id: -1 })              
   .limit(10).populate("userId")
   const nextCursor = messages.length > 0 ? messages[messages.length - 1]._id : null;

   return NextResponse.json({
    items: messages,
    nextCursor,
  });
  
 }catch(e){
    console.log(e)
    return new NextResponse("Something HAppened",{status:500})
 }
}