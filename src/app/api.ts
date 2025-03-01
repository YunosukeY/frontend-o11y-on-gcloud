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
        logName: `projects/${serviceAccount.projectId}/logs/frontend-o11y-on-gcloud`,
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

type Span = {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  displayName: string;
  startTime: Date;
  endTime: Date;
};

export const writeSpans = async (spans: Span[]) => {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `https://cloudtrace.googleapis.com/v2/projects/${serviceAccount.projectId}/traces:batchWrite`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        spans: spans.map((span) => ({
          name: `projects/${serviceAccount.projectId}/traces/${span.traceId}/spans/${span.spanId}`,
          spanId: span.spanId,
          parentSpanId: span.parentSpanId,
          displayName: {
            value: span.displayName,
            truncatedByteCount: 0,
          },
          startTime: span.startTime.toISOString(),
          endTime: span.endTime.toISOString(),
        })),
      }),
    }
  );
  const data = await response.json();
  return data;
};
