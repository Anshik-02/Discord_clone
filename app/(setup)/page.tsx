import { InitalDailogue } from "@/components/models/initail-model";
import { connectDB } from "@/lib/db";
import { InitialProfile } from "@/lib/inital-profile";
import { memberModel, serverModel } from "@/model/schema";
import mongoose from "mongoose";
import { redirect } from "next/navigation"; 



export default async function Home() {
const profile=await InitialProfile()

await connectDB()
const member = await memberModel.find({
  userId: profile._id
});
const memberIds=member.map((memb)=>memb._id)

console.log("current profile",memberIds)

if (!member) {
  return (
    <div className="h-screen flex items-center justify-center">
      <InitalDailogue />
    </div>
  );
}
const server = await serverModel.findOne({
  memberId:{$in: memberIds }
});
console.log(server)

if(server){
return redirect(`/servers/${server.id}`)
}
  return (
    <div className="h-screen flex items-center justify-center ">
      <InitalDailogue/>
    </div>
  );
}
