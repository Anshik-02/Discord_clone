import { conversationModel, memberModel } from "@/model/schema";
import { console } from "inspector";

export const getOrCreateConvo = async (
  userOneId: string,
  userTwoId: string
) => {
  let conversation =
    (await findConversation(userOneId, userTwoId)) ||
    (await findConversation(userTwoId, userOneId));
  if (!conversation) conversation = await newConversation(userOneId, userTwoId);
  return conversation;
};

const findConversation = async (userOneId: string, userTwoId: string) => {
  try {
    const convo = await conversationModel.findOne({
      userOneId,
      userTwoId,
    });

    if (convo) {
      const memberOne = await memberModel.findOne({ _id: userOneId }).populate("userId");
      const memberTwo = await memberModel.findOne({ _id: userTwoId }).populate("userId");
      return {
        memberOne,
        memberTwo,
        conversation: convo,
      };
    }
  } catch (e) {
    return null;
  }
};


const newConversation = async (userOneId: string, userTwoId: string) => {
  const convo = await conversationModel.create({
    userOneId,
    userTwoId,
  });

  const memberOne = await memberModel.findOne({ _id: userOneId }).populate("userId");
  const memberTwo = await memberModel.findOne({ _id: userTwoId }).populate("userId");

  return {
    memberOne,
    memberTwo,
    conversation: convo,
  };
};
