import type { Credentials } from "./auth.js";

const BASE_URL = "https://api-partner.spotify.com/ads/v3";

interface CallOptions {
  creds: Credentials;
  path: string;
  method?: "GET" | "POST";
  params?: Record<string, string>;
  body?: unknown;
}

export async function callApi(opts: CallOptions): Promise<unknown> {
  const method = opts.method ?? "GET";
  const url = new URL(`${BASE_URL}/${opts.path}`);
  if (opts.params) {
    for (const [k, v] of Object.entries(opts.params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${opts.creds.access_token}`,
    Accept: "application/json",
  };

  const init: RequestInit = { method, headers };

  if (method === "POST" && opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url.toString(), init);

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    data = { rawResponse: text };
  }

  if (!res.ok) {
    const err = data as Record<string, unknown>;
    const msg = err?.message ? String(err.message) : `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
