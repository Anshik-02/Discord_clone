import { currentProfile } from '@/lib/current-profile'
import { memberModel, profileModel, serverModel } from '@/model/schema'
import { redirect } from 'next/navigation'
import React from 'react'

interface InviteCodePage {
  params: {
    inviteCode: string
  }
}

export default async function InviteCodePage({ params }: InviteCodePage) {
  const profile = await currentProfile()
  if (!profile) {
    return redirect("/")
  }

  if (!params.inviteCode) {
    return redirect("/")
  }

  const member = await memberModel.find({
    userId: profile.id,
  })

  const memberIds = member.map((memb) => memb._id)

  const existingServer = await serverModel.findOne({
    inviteCode: params.inviteCode,
    memberId: { $in: memberIds }
  })

  if (existingServer) {
    return redirect(`/servers/${existingServer._id}`)
  }

  const server = await serverModel.findOne({
    inviteCode: params.inviteCode
  })

  if (!server) {
    return redirect("/") 
  }

  const newMember = await memberModel.create({
    userId: profile.id,
    serverId: server.id,
    role: "Member"
  })

  await serverModel.updateOne(
    { _id: server.id },
    { $push: { memberId: newMember._id } }
  )

  await profileModel.updateOne(
    { _id: profile.id },
    { $push: { servers: server.id } }
  )

  return redirect(`/servers/${server._id}`)
}
