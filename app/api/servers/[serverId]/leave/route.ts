import { currentProfile } from "@/lib/current-profile";
import { memberModel, serverModel } from "@/model/schema";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }
    if (!(await params).serverId) {
        return NextResponse.json("ServerId is required", { status: 400 });
    }
const memberId=await memberModel.findOne({
    userId:profile.id,
    serverId:(await params).serverId
})
console.log(memberId)

await serverModel.updateOne(
    { _id:(await params).serverId }, 
    { $pull: { members: memberId._id } } 
  );

await memberModel.deleteOne({
    _id:memberId
})

return NextResponse.json("hwheheh")
  } catch (e) {
    console.log(e);
    return NextResponse.json("Error nd all", { status: 500 });
  }
}
