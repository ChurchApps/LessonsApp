import { ApiHelper } from "@churchapps/apphelper";
import { downloadRequest, type DownloadLogInterface } from "./downloadRequest";

/** Records a download with the LessonsApi without blocking or failing the click that caused it. */
export function logDownload(download: DownloadLogInterface): void {
  const config = ApiHelper.getConfig("LessonsApi");
  if (!config?.url || typeof fetch !== "function") return;
  fetch(config.url + "/downloads", downloadRequest([download], config.jwt)).catch(() => { /* analytics only */ });
}
