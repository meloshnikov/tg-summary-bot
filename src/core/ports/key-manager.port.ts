export interface KeyManagerPort {
  isInitialized(): boolean;
  generateKey(): Buffer<ArrayBufferLike>;
  encryptMaster(data: Buffer): string;
  decryptMaster(data: string): Buffer;
  encrypt(key: Buffer, text: string): string;
  decrypt(key: Buffer, data: string): string;
}
