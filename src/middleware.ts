import { NextRequest, NextResponse } from "next/server";

// Optional HTTP Basic Auth gate.
// Set AUTH_USER + AUTH_PASS in your hosting env to require a password prompt on every visit.
// Leave them unset for open access (local dev / public demo).
const USER = process.env.AUTH_USER ?? "";
const PASS = process.env.AUTH_PASS ?? "";
const AUTH_DISABLED = !USER || !PASS;

export function middleware(req: NextRequest) {
  if (AUTH_DISABLED) return NextResponse.next();

  const header = req.headers.get("authorization");
  if (header) {
    const [scheme, encoded] = header.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const idx = decoded.indexOf(":");
        const user = decoded.slice(0, idx);
        const pass = decoded.slice(idx + 1);
        if (user === USER && pass === PASS) {
          return NextResponse.next();
        }
      } catch {
        // fall through to 401
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Marketing Dashboard"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
