import { randomFillSync } from "crypto";

export class SecureBuffer {
  private buffer: Buffer | null;

  constructor(data: Buffer) {
    this.buffer = Buffer.from(data);
  }

  use<T>(callback: (data: Buffer) => T): T {
    if (!this.buffer) throw new Error("Buffer is destroyed");
    try {
      return callback(this.buffer);
    } finally {
      randomFillSync(this.buffer);
      this.buffer = null;
    }
  }
}
