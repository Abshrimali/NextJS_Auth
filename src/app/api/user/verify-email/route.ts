import connectDB from "@/config/db";
import { User } from "@/models/userModel";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const reqbody = await request.json();
    const { token } = reqbody;
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return Response.json({ message: "Invalid Token" }, { status: 400 });
    }
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();
    return Response.json(
      {
        message: "email verified successfully",
        success: true,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      {
        error: error.message || "internal server error",
      },
      { status: 500 },
    );
  }
}
