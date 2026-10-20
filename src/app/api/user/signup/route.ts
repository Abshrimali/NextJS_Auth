
import connectDb from "@/config/db.js";
import { User } from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/utils/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: "User is already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await sendMail({
      userEmail: userCreated.email,
      emailType: "Verify-Email",
      userId: userCreated._id.toString(),
    });

    const userResponse = userCreated.toObject();
    delete userResponse.password;

    return NextResponse.json(
      {
        message: "Signup successful. Verification email has been sent.",
        userCreated: userResponse,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
