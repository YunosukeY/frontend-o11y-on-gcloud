'use client';

import { useEffect } from "react";
import { writeLogs } from "./api";
import { onCLS, onINP, onLCP } from "web-vitals";
import { onReport } from "./web-vitals";

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

  return <h1>Client Component</h1>;
};
