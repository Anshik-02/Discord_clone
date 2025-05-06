import mongoose,{Schema} from "mongoose";

 const MemberRoles = ["Member", "Admin", "Moderator"] as const;
export type MemberRole = typeof MemberRoles[number];

 export const ChannelTypes = ["Voice", "Text", "Video"] as const;


const profile=new Schema({
    userId:{type:String,required:true},
    username:{type:String,required:true},
    imageUrl:{type:String,required:true},
    emailId:{type:String,required:true},
    servers:[{type:Schema.Types.ObjectId, ref: "Server"}]
},{timestamps:true})

const server=new Schema({
    name:{type:String,required:true},
    imageUrl:{type:String,required:true},
    inviteCode:{type:String,required:true},
    memberId:[{type:mongoose.Schema.Types.ObjectId, ref: "Member"}],
    creatorId:{type:Schema.Types.ObjectId, ref: "Profile",required:true},
    channelId:[{type:Schema.Types.ObjectId, ref: "Channel"}]
},{timestamps:true})

const member=new Schema({
    role:{type:String,enum:MemberRoles,required:true,default:"Member"},
    userId:{type:Schema.Types.ObjectId, ref: "Profile",required:true},
    serverId:{type:Schema.Types.ObjectId, ref: "Server",required:true}
},{timestamps:true}) 


const channel=new Schema({
    name:{type:String,required:true},
    type: { type: String, enum: ChannelTypes, required: true },
    userId:{type:Schema.Types.ObjectId, ref: "Profile",required:true},
    serverId:{type:Schema.Types.ObjectId, ref: "Server",required:true}
},{timestamps:true})

const message=new Schema({
    message:{type:String,required:true},
    imageUrl:{type:String},
    channelId:{type:Schema.Types.ObjectId, ref: "Channel",required:true},
    userId:{type:Schema.Types.ObjectId, ref: "Profile",required:true},
    deleted:{type:Boolean,default:false}
},{timestamps:true})

const conversation=new Schema({
    message:{type:String},
    userOneId:{type:Schema.Types.ObjectId, ref: "Profile",required:true},
    userTwoId:{type:Schema.Types.ObjectId, ref: "Profile",required:true},
    directMessage:{type:Schema.Types.ObjectId, ref: "DirectMessage"},

},{timestamps:true})

const directMessage=new Schema({
    message:{type:String,required:true},
    imageUrl:{type:String},
    userId:{type:Schema.Types.ObjectId, ref: "Profile",required:true},
    conversationId:{type:Schema.Types.ObjectId, ref: "Conversation",required:true},
    deleted:{type:Boolean,default:false}

},{timestamps:true})

const profileModel=mongoose.models.Profile ||mongoose.model("Profile",profile)
const serverModel=mongoose.models.Server ||mongoose.model("Server",server)
const memberModel=mongoose.models.Member ||mongoose.model("Member",member)
const channelModel=mongoose.models.Channel ||mongoose.model("Channel",channel)
const messageModel=mongoose.models.Message ||mongoose.model("Message",message)
const conversationModel=mongoose.models.Conversation ||mongoose.model("Conversation",conversation)
const directMessageModel=mongoose.models.DirectMessage ||mongoose.model("DirectMessage",directMessage)

export{profileModel,serverModel,memberModel,channelModel,messageModel,conversationModel,directMessageModel};