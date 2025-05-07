import { currentProfile } from "@/lib/current-profile"
import { profileModel, serverModel } from "@/model/schema"
import { NextResponse } from "next/server"

export async function PATCH(req:Request,{params}:{params:{serverId:string}}) {
    try{
const profile=await currentProfile()
if(!profile){
    return NextResponse.json("Unauthorized user",{status:401})
}
const {name,imageUrl}=await req.json()

const updatedServer=await serverModel.updateOne(
    {_id:(await params).serverId,
    },
    {$set:{imageUrl:imageUrl,
        name:name
    }}
)
return NextResponse.json("ServerUpdated",{status:200})
    }catch(e){
        console.log(e)
        return NextResponse.json("SOmething happened",{status:500})
    }
}

export async function DELETE(req:Request,{params}:{params:{serverId:string}}) {
    try{
const profile=await currentProfile()
if(!profile){
    return NextResponse.json("Unauthorized user",{status:401})
}

    await profileModel.updateOne({
        _id:profile.id
    },{$pull:{servers:(await params).serverId}})

    const deleteServer=await serverModel.deleteOne({
    _id:(await params).serverId
    }
    )

return NextResponse.json("ServerDeleted",{status:200})
    }catch(e){
        console.log(e)
        return NextResponse.json("SOmething happened",{status:500})
    }
}

