"use server";

import { db } from "./db";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("4 week from now")
        .sign(key);
}

export async function decrypt(input: string) {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });

    return payload;
}

export async function login(password) {
    const admin = password == process.env.ADMIN_PASSWORD;

    if (!admin && password != process.env.PARENT_PASSWORD) {
        return { error: "Invalid password" };
    }

    const data = {
        admin: admin
    }

    const expires = new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ data, expires });

    cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
    cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
}

export async function updateSession(session, request: NextRequest) {
    if (!session) return;

    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 10 * 1000);

    const res = NextResponse.next();

    res.cookies.set({
        name: "session",
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });

    return res;
}
