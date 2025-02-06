import { getAccessToken, serviceAccount } from "./serviceAccount";

type LogSeverity =
  | "DEFAULT"
  | "DEBUG"
  | "INFO"
  | "NOTICE"
  | "WARNING"
  | "ERROR"
  | "CRITICAL"
  | "ALERT"
  | "EMERGENCY";

type Log = {
  severity: LogSeverity;
  timestamp: Date;
  message: string;
};

export const writeLogs = async (logs: Log[]) => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    "https://logging.googleapis.com/v2/entries:write",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logName: `projects/${serviceAccount.projectId}/logs/frontend-o11y-with-gcloud`,
        resource: {
          type: "global",
          labels: {
            project_id: serviceAccount.projectId,
          },
        },
        entries: logs.map((log) => ({
          timestamp: log.timestamp.toISOString(),
          severity: log.severity,
          labels: {
            service: "frontend",
          },
          jsonPayload: {
            message: log.message,
          },
        })),
        partialSuccess: true,
      }),
    }
  );
  const data = await response.json();
  return data;
};
