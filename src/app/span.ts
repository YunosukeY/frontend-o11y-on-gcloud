import { writeSpans } from "./api";

const genHexStr = (len: number) => {
  const bytes = new Uint8Array(Math.ceil(len / 2));
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, len);
};

export class Span {
  private traceId: string;
  private spanId: string;
  private parentSpanId?: string;
  private displayName: string;
  private startTime: Date;
  private endTime?: Date;

  constructor(displayName: string, parentSpan?: Span) {
    this.traceId = parentSpan ? parentSpan.traceId : genHexStr(32);
    this.spanId = genHexStr(16);
    if (parentSpan) {
      this.parentSpanId = parentSpan.spanId;
    }
    this.displayName = displayName;
    this.startTime = new Date();
  }

  public end() {
    this.endTime = new Date();

    writeSpans([
      {
        traceId: this.traceId,
        spanId: this.spanId,
        parentSpanId: this.parentSpanId,
        displayName: this.displayName,
        startTime: this.startTime,
        endTime: this.endTime,
      },
    ]);
  }
}
