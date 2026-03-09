import { type NextRequest, NextResponse } from "next/server";
import https from "node:https";
import { HttpsProxyAgent } from "https-proxy-agent";

const TAMBO_BASE = "https://api.tambo.co";
const proxyUrl = process.env.HTTPS_PROXY || process.env.https_proxy;
const agent = proxyUrl ? new HttpsProxyAgent(proxyUrl) : undefined;

/**
 * Proxy all requests to the Tambo API to avoid browser CORS issues.
 */
function proxyRequest(
  method: string,
  targetUrl: string,
  headers: Record<string, string>,
  body?: Buffer | null
): Promise<{ status: number; headers: Record<string, string>; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const url = new URL(targetUrl);
    const options: https.RequestOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method,
      headers,
      agent,
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const respHeaders: Record<string, string> = {};
        for (const [key, value] of Object.entries(res.headers)) {
          if (value) respHeaders[key] = Array.isArray(value) ? value.join(", ") : value;
        }
        resolve({
          status: res.statusCode || 500,
          headers: respHeaders,
          body: Buffer.concat(chunks),
        });
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const target = `${TAMBO_BASE}/${path.join("/")}${req.nextUrl.search}`;

  // Collect headers to forward
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "host" && key.toLowerCase() !== "connection") {
      headers[key] = value;
    }
  });

  // Read body for non-GET requests
  let body: Buffer | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const arrayBuf = await req.arrayBuffer();
    body = Buffer.from(arrayBuf);
  }

  try {
    const res = await proxyRequest(req.method, target, headers, body);

    // Return proxied response
    const responseHeaders = new Headers();
    for (const [key, value] of Object.entries(res.headers)) {
      // Skip problematic headers
      if (["transfer-encoding", "content-encoding", "connection"].includes(key.toLowerCase())) continue;
      responseHeaders.set(key, value);
    }

    return new Response(new Uint8Array(res.body), {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy request failed" }, { status: 502 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
