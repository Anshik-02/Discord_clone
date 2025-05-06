import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { connectDB } from "./db";
import { profileModel } from "@/model/schema";

export const InitialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  await connectDB();
  const profile = await profileModel.findOne({
    userId: user.id,
  });

  if (profile) {
    return profile;
  }
  const newProfile = await profileModel.create({
    username: `${user.firstName} ${user.lastName}`,
    imageUrl: user.imageUrl,
    emailId: user.emailAddresses[0].emailAddress,
    userId: user.id,
  });
  return(newProfile)
};
