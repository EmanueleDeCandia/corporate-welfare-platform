import { NextResponse } from "next/server";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

function originFrom(request: Request) {
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") ?? "http";
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") === "invite" ? "invite" : "venue";
  const path = kind === "invite" ? `/r/${code}` : `/checkin/${code}`;
  const target = `${originFrom(request)}${path}`;
  const png = await QRCode.toBuffer(target, {
    width: 640,
    margin: 1,
    color: { dark: "#1C3A2E", light: "#FBF7F0" },
    errorCorrectionLevel: "M",
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=3600",
    },
  });
}