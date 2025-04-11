import { NextResponse } from "next/server";


export function GET(req: Request) {
  return NextResponse.json({
    message: "Not working"
  }, { status: 501 })
}
