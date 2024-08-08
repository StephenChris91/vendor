export const dynamic = 'force-dynamic'; // Add this line to mark the route as dynamic


import { auth } from "auth"; // Use the correct import for auth function
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (session) {
      return NextResponse.json(session.user);
    } else {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
