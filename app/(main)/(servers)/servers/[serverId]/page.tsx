import { currentProfile } from "@/lib/current-profile"
import { channelModel, serverModel } from "@/model/schema"
import { redirect } from "next/navigation"

interface ServerIdPageProps{
  params:{serverId:string}
}
export default async function ServerIdPage({params}:ServerIdPageProps) {
  const profile=await currentProfile()

  if(!profile){
    return redirect("/")
  }

const server=await serverModel.findOne({
_id:( await params).serverId,
})
const channel=await channelModel.findOne({
  name:"general",serverId:server._id
})



  return redirect(`/servers/${(await params).serverId}/channels/${channel._id}`)
}
