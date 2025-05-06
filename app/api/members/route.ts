
import { memberModel } from "@/model/schema";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { memberIds } = await req.json();

  try {
    const members = await memberModel
      .find({ _id: { $in: memberIds } })
      .populate("userId"); 


    const formatted = members.map((member) => ({
      _id: member._id,
      role: member.role,
      user: {
        name: member.userId.name,
        imageUrl: member.userId.imageUrl,
        id: member.userId._id,
        username:member.userId.username,
        email:member.userId.emailId
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
