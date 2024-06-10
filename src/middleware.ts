import { NextRequest, NextResponse } from "next/server";
import { updateSession, getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const session = await getSession();

    if (!session && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('./login', request.url));
    }

    return NextResponse.next();
}