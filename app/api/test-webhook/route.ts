import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    console.log("✅ Test webhook called - POST");
    return NextResponse.json({ status: "ok", method: "POST" });
}

export async function GET(request: NextRequest) {
    console.log("✅ Test webhook called - GET");
    return NextResponse.json({ status: "ok", method: "GET" });
}
