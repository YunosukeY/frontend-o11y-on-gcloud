import type { Metric } from "web-vitals";
import { writeMetrics } from "./api";

export const onReport = (metric: Metric) => {
  writeMetrics([
    {
      type: metric.name,
      kind: "GAUGE",
      valueType: "DOUBLE",
      points: [
        {
          interval: {
            endTime: new Date().toISOString(),
          },
          value: {
            doubleValue: metric.value,
          },
        },
      ],
    },
  ]);
};
