import { getAuth } from "@clerk/nextjs/server";
import { connectDB } from "./db";
import { profileModel } from "@/model/schema";
import { NextApiRequest } from "next";

export const currentProfilePages=async(req:NextApiRequest)=>{
const {userId}=await getAuth(req)
console.log(userId)
if(!userId){
    return null
}
await connectDB()
const profile=await profileModel.findOne({
    userId:{$in:(userId)}
})
return profile

}