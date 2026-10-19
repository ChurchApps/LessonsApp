export interface DownloadLogInterface {
  lessonId?: string;
  fileId?: string;
  userId?: string;
  churchId?: string;
  ipAddress?: string;
  downloadDate?: Date;
  fileName?: string;
}

/**
 * The request that records a download. The click that sends it also starts the file download or
 * opens a preview, and Safari cancels an ordinary fetch as soon as the page navigates ("Load failed",
 * Sentry LESSONS-3T). keepalive lets the browser finish the request after the page is gone.
 */
export function downloadRequest(downloads: DownloadLogInterface[], jwt?: string): RequestInit {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (jwt) headers.Authorization = "Bearer " + jwt;
  return { method: "POST", headers, body: JSON.stringify(downloads), keepalive: true };
}
