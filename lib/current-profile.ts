import { auth } from "@clerk/nextjs/server";
import { connectDB } from "./db";
import { profileModel } from "@/model/schema";
import mongoose from "mongoose";

export const currentProfile=async()=>{
const {userId}=await auth()

if(!userId){
    return null
}
await connectDB()
const profile=await profileModel.findOne({
    userId:{$in:(userId)}
})
return profile

}