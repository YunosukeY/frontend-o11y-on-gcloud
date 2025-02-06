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

type MetricKind = "METRIC_KIND_UNSPECIFIED" | "GAUGE" | "DELTA" | "CUMULATIVE";

type MetricValueType =
  | "VALUE_TYPE_UNSPECIFIED"
  | "BOOL"
  | "INT64"
  | "DOUBLE"
  | "STRING"
  | "DISTRIBUTION";

type MetricDataPoint = {
  interval: {
    startTime?: string;
    endTime: string;
  };
  value:
    | {
        boolValue: boolean;
      }
    | {
        int64Value: string;
      }
    | {
        doubleValue: number;
      }
    | {
        stringValue: string;
      }
    | {
        distributionValue: unknown; // TODO
      };
};

type Metric = {
  type: string;
  kind: MetricKind;
  valueType: MetricValueType;
  points: MetricDataPoint[];
};

export const writeMetrics = async (metrics: Metric[]) => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://monitoring.googleapis.com/v3/projects/${serviceAccount.projectId}/timeSeries`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeSeries: metrics.map((metric) => ({
          metric: {
            type: `custom.googleapis.com/frontend/${metric.type}`,
          },
          resource: {
            type: "global",
            labels: {
              project_id: serviceAccount.projectId,
            },
          },
          metricKind: metric.kind,
          valueType: metric.valueType,
          points: metric.points,
        })),
      }),
    }
  );
  const data = await response.json();
  return data;
};
