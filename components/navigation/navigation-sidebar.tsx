import { currentProfile } from "@/lib/current-profile"
import { connectDB } from "@/lib/db"
import { memberModel, serverModel } from "@/model/schema"
import { redirect } from "next/navigation"
import NavigationAction from "./navigation-action"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import NavigationItem from "./navigation-item"
import { ModeToggle } from "../mode-toggle"
import { UserButton } from "@clerk/nextjs"


export default async function NavigationSidebar() {
  const profile=await currentProfile()
  if(!profile){
    redirect("/")
  }
  await connectDB()
  const members=await memberModel.find({
userId:profile._id
  })
  const memberIds = members.map((member) => member._id)

  const server=await serverModel.find({
    memberId:{$in:memberIds}
  })

  
    return (
    <div className="space-y-4 flex flex-col items-center dark:bg-[#1E1F22] !h-full w-full text-primary py-3 ">
        <NavigationAction/>
        <div className="w-10 h-[1px] mx-auto bg-zinc-300 dark:bg-zinc-700" >
        <Separator />
        </div>
          <ScrollArea >
              {server.map((servers,key)=>(
                  <div key={servers.id}>
  <NavigationItem 
  name={servers.name}
  id={servers.id}
  imageUrl={servers.imageUrl}/>
                  </div>
              ))}
          </ScrollArea>
        <div className=" mt-auto flex flex-col gap-y-4 items-center  ">
<ModeToggle/>
<UserButton
afterSignOutUrl="/"
appearance={{elements:{avatarBox:"h-[48px] w-[48px]"}}}/>
        </div>
        </div>
  )
}
