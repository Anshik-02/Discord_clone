"use client";
import { CreateChannelModel } from "@/components/models/create-channel-model";
import { CreateServerModel } from "@/components/models/create-server-model";
import { DeleteChannelModel } from "@/components/models/delete-channel-model";
import { DeleteServerModel } from "@/components/models/delete-server-model";
import { EditChannelModel } from "@/components/models/edit-channel-model";
import { EditServerModel } from "@/components/models/edit-server-model";
import { InviteModel } from "@/components/models/invite-model";
import { LeaveServerModel } from "@/components/models/leave-server-model";
import { MembersModel } from "@/components/models/members-model";
import { useModel } from "@/hooks/use-model-store";
import React, { useEffect, useState } from "react";
import { MessageFileModel } from "../models/file-model";
import { DeleteMessageModel } from "../models/delete-message-model";

export default function ModalProvider() {
  const { type, isOpen } = useModel();

  if (!isOpen || !type) return null;

  switch (type) {
    case "createServer":
      return <CreateServerModel />;
    case "invite":
      return <InviteModel />;
    case "editServer":
      return <EditServerModel />;
    case "members":
      return <MembersModel />;
    case "createChannel":
      return <CreateChannelModel />;
    case "leaveServer":
      return <LeaveServerModel />;
    case "deleteServer":
      return <DeleteServerModel />;
    case "deleteChannel":
      return <DeleteChannelModel />;
    case "editChannel":
      return <EditChannelModel />;
    case "messageFile":
      return <MessageFileModel />;
    case "deleteMessage":
      return <DeleteMessageModel />;
    default:
      return null;
  }
}