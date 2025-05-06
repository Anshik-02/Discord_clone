import { currentProfile } from "@/lib/current-profile";
import { memberModel, serverModel } from "@/model/schema";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const { role } = await req.json();
    const serverId = searchParams.get("serverId");

    if (!profile) {
      return NextResponse.json("Unauthorized user", { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json("ServerID is required", { status: 400 });
    }

    if (!(await params).memberId) {
      return NextResponse.json("memberId is required", { status: 400 });
    }

    const member = await memberModel.findOneAndUpdate(
      {
        _id: (await params).memberId,
        serverId,
      },
      {
        role,
      },
      {
        new: true,
      }
    );

    const server = await serverModel.findById(serverId);

    return NextResponse.json(server, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { memberId: string } }) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");
    const memberId = params.memberId;

    if (!profile) {
      return NextResponse.json("Unauthorized user", { status: 401 });
    }

    if (!serverId) {
      return NextResponse.json("ServerID is required", { status: 400 });
    }

    if (!memberId) {
      return NextResponse.json("memberId is required", { status: 400 });
    }
console.log("hehe",memberId)
    const deletedMember = await memberModel.deleteOne({
      _id: memberId,
    });
    const updatedServer = await serverModel.findByIdAndUpdate(
      serverId,
      { $pull: { memberId: memberId } },
      { new: true } 
    );
    const server = await serverModel.findById(serverId);

    return NextResponse.json(server, { status: 200 });

  } catch (e) {
    console.error("Delete Member Error:", e);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
