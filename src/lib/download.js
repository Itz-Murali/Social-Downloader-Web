import { fileNameFor } from "./format";

function triggerBlob(blobUrl, filename) {
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.rel = "noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function proxyUrl(url, filename) {
  return `/api/download?url=${encodeURIComponent(url)}&name=${encodeURIComponent(filename)}`;
}

async function streamToBlob(response, onProgress) {
  const total = Number(response.headers.get("content-length")) || 0;
  if (!response.body || !response.body.getReader) return response.blob();
  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (onProgress) onProgress(total ? Math.min(99, Math.round((loaded / total) * 100)) : null);
  }
  return new Blob(chunks);
}

async function attempt(requestUrl, onProgress) {
  const response = await fetch(requestUrl, { mode: "cors", credentials: "omit" });
  if (!response.ok) throw new Error(`Upstream responded with ${response.status}`);
  const blob = await streamToBlob(response, onProgress);
  if (!blob || !blob.size) throw new Error("Empty file");
  return blob;
}


export async function downloadToBrowser(url, title, kind, onProgress) {
  const filename = fileNameFor(title, kind);
  const routes = [url, proxyUrl(url, filename)];

  for (const route of routes) {
    try {
      if (onProgress) onProgress(null);
      const blob = await attempt(route, onProgress);
      const blobUrl = URL.createObjectURL(blob);
      if (onProgress) onProgress(100);
      triggerBlob(blobUrl, filename);
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      return { ok: true, fallback: false };
    } catch (error) {
    }
  }

  const opened =
    window.open(proxyUrl(url, filename), "_blank", "noopener,noreferrer") ||
    window.open(url, "_blank", "noopener,noreferrer");
  return {
    ok: false,
    fallback: true,
    message: opened ? "Opened in a new tab" : "Download blocked by the browser",
  };
}
