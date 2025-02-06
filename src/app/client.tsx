'use client';

import { useEffect } from "react";
import { writeLogs } from "./api";
import { onCLS, onINP, onLCP } from "web-vitals";
import { onReport } from "./web-vitals";
import { Span } from "./span";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const f1 = async () => {
  const span = new Span("f1");
  await sleep(500);
  await f2(span);
  await sleep(500);
  span.end();
}

const f2 = async (parentSpan: Span) => {
  const span = new Span("f2", parentSpan);
  await sleep(500);
  span.end();
}

export const Client: React.FC = () => {
  useEffect(() => {
    writeLogs([{
      severity: "INFO",
      timestamp: new Date(),
      message: "Client component mounted."
    }]);
  }, []);

  useEffect(() => {
    onCLS(onReport);
    onINP(onReport);
    onLCP(onReport);
  }, [])

  useEffect(() => {
    f1();
  }, []);

  return <h1>Client Component</h1>;
};
