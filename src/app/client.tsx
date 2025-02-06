'use client';

import { useEffect } from "react";
import { writeLogs } from "./api";

export const Client: React.FC = () => {
  useEffect(() => {
    writeLogs([{
      severity: "INFO",
      timestamp: new Date(),
      message: "Client component mounted."
    }]);
  }, []);

  return <h1>Client Component</h1>;
};
