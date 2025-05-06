import { currentProfile } from "@/lib/current-profile";
import { connectDB } from "@/lib/db";
import { serverModel } from "@/model/schema";
import { NextResponse } from "next/server";
import {v4 as uuidv4} from "uuid"

export async function PATCH(
    req:Request,
    {params}:{params:{serverId:string}}
) {
    try{
     
        const profile=await currentProfile()
        if(!profile){
            return NextResponse.json("unauthorized user",{status:401})
        }
        
        if(!(await params).serverId){
            return NextResponse.json("server id not found",{status:404})
        }
    await connectDB()


const server=await serverModel.updateOne(
    {_id:(await params).serverId},
{$set:{ inviteCode:uuidv4()}})

const serverr=await serverModel.findById(
    (await params).serverId
)


return NextResponse.json(serverr,{status:200})
    }catch(e){
        console.log(e)
    }       



}