import { NextResponse } from "next/server";
import http from "node:http";
import https from "node:https";

/* ============================================
   ICY Metadata Proxy — /api/now-playing

   Reimplements stream-icy-meta.php in Node.js.
   Opens the audio stream with the Icy-MetaData
   header, reads the icy-metaint offset, then
   extracts the StreamTitle from the raw bytes.

   Falls back to a direct HTTP GET (like
   fallback.php) if ICY parsing fails.
   ============================================ */

const STREAM_URL = process.env.STREAM_URL ?? "";
const FETCH_TIMEOUT = 8_000;

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  if (!STREAM_URL) {
    return NextResponse.json(
      { title: "", error: "STREAM_URL not configured" },
      { status: 500 }
    );
  }

  try {
    const title = await getIcyMetadata(STREAM_URL);

    if (title) {
      return NextResponse.json(
        { title, fetchedAt: Date.now() },
        {
          headers: {
            "Cache-Control": "no-cache, must-revalidate, max-age=0",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Fallback: direct HTTP fetch (mirrors fallback.php)
    const fallbackTitle = await getFallbackMetadata(STREAM_URL);

    return NextResponse.json(
      { title: fallbackTitle ?? "", fetchedAt: Date.now() },
      {
        headers: {
          "Cache-Control": "no-cache, must-revalidate, max-age=0",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { title: "", fetchedAt: Date.now() },
      {
        headers: {
          "Cache-Control": "no-cache, must-revalidate, max-age=0",
        },
      }
    );
  }
}

/**
 * Primary method: request ICY metadata inline with the audio stream.
 * Mirrors the PHP getMp3StreamTitle() logic:
 * 1. Send Icy-MetaData: 1 header
 * 2. Read icy-metaint from response headers
 * 3. Skip that many bytes of audio data
 * 4. Read the metadata block and extract StreamTitle
 *
 * Follows up to MAX_REDIRECTS 301/302 redirects (Node http.get
 * does not follow redirects automatically).
 */
const MAX_REDIRECTS = 5;

function getIcyMetadata(
  streamUrl: string,
  redirectCount = 0
): Promise<string | null> {
  return new Promise((resolve) => {
    const url = new URL(streamUrl);
    const transport = url.protocol === "https:" ? https : http;

    const req = transport.get(
      streamUrl,
      {
        headers: {
          "Icy-MetaData": "1",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
        timeout: FETCH_TIMEOUT,
      },
      (res) => {
        // Follow redirects
        if (
          (res.statusCode === 301 || res.statusCode === 302) &&
          res.headers.location &&
          redirectCount < MAX_REDIRECTS
        ) {
          res.destroy();
          resolve(getIcyMetadata(res.headers.location, redirectCount + 1));
          return;
        }

        const metaInt = parseInt(
          (res.headers as Record<string, string>)["icy-metaint"] ?? "-1",
          10
        );

        if (metaInt < 0) {
          res.destroy();
          resolve(null);
          return;
        }

        let bytesRead = 0;
        const chunks: Buffer[] = [];

        res.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
          bytesRead += chunk.length;

          // We need metaInt bytes of audio + some metadata bytes
          if (bytesRead > metaInt + 512) {
            res.destroy();

            const buffer = Buffer.concat(chunks);
            const metaStart = metaInt;
            const metaLengthByte = buffer[metaStart];

            if (metaLengthByte === undefined || metaLengthByte === 0) {
              resolve(null);
              return;
            }

            const metaLength = metaLengthByte * 16;
            const metaData = buffer
              .subarray(metaStart + 1, metaStart + 1 + metaLength)
              .toString("utf-8");

            const match = metaData.match(/StreamTitle='([^']*?)'/);
            resolve(match?.[1]?.trim() ?? null);
          }
        });

        res.on("error", () => resolve(null));
      }
    );

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
}

/**
 * Fallback: direct HTTP GET, reading up to 12KB.
 * Mirrors fallback.php — tries to get metadata from
 * a status page URL or plain-text endpoint.
 */
function getFallbackMetadata(
  streamUrl: string,
  redirectCount = 0
): Promise<string | null> {
  return new Promise((resolve) => {
    const url = new URL(streamUrl);
    const transport = url.protocol === "https:" ? https : http;

    const req = transport.get(
      streamUrl,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        timeout: FETCH_TIMEOUT,
      },
      (res) => {
        if (
          (res.statusCode === 301 || res.statusCode === 302) &&
          res.headers.location &&
          redirectCount < MAX_REDIRECTS
        ) {
          res.destroy();
          resolve(getFallbackMetadata(res.headers.location, redirectCount + 1));
          return;
        }

        let data = "";
        let bytesRead = 0;
        const maxBytes = 12_000;

        res.setEncoding("utf-8");

        res.on("data", (chunk: string) => {
          data += chunk;
          bytesRead += Buffer.byteLength(chunk);

          if (bytesRead >= maxBytes) {
            res.destroy();
          }
        });

        res.on("end", () => resolve(data.trim() || null));
        res.on("close", () => resolve(data.trim() || null));
        res.on("error", () => resolve(null));
      }
    );

    req.on("error", () => resolve(null));
    req.on("timeout", () => {
      req.destroy();
      resolve(null);
    });
  });
}
