import connectDb from "@/config/db.js";

export async function POST(req, { params }) {
  connectDb();
  try {
    const reqbody = await req.json();
    return Response.json(
      { message: "user registered successfully", reqbody },
      { status: 201 },
    );
  } catch (error) {
    return Response.json(
      { error: error.message || "internal server error" },
      { status: 500 },
    );
  }
}
