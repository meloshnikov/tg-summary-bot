import axios from "axios";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { timingSafeEqual } from "crypto";
import { KeyManagerPort } from "src/core/ports";
import { envConfig } from "../config";

export class KeyManagementAdapter implements KeyManagerPort {
  private masterKey: Buffer | null = null;
  private readonly KEY_LENGTH = 32;
  private readonly INIT_RETRIES = 3;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.initialize().catch(error => {
      console.error("Critical initialization error:", error);
      process.exit(1);
    });
  }

  private async initialize(): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.loadProvidedMasterKey(this.INIT_RETRIES);
    return this.initializationPromise;
  }

  private async loadProvidedMasterKey(retries: number): Promise<void> {
    try {
      const key = await this.getKeyFromMasterKeyVault();
      await this.initializeKey(key);
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.loadProvidedMasterKey(retries - 1);
      }
      throw new Error(`Master Key Vault key fetch failed: ${error}`);
    }
  }

  private async getKeyFromMasterKeyVault(): Promise<string> {
    const HOST = envConfig.get('MKV_HOST');
    const TOKEN = envConfig.get('MKV_API_TOKEN');

    if (!HOST || !TOKEN) {
      throw new Error("Missing Master Key Vault configuration");
    }
  
    const { data } = await axios.get<string>(`https://${HOST}`, { headers: { Authorization: `Bearer ${TOKEN}` }, responseType: 'text' });

    return data;
  }


  private async initializeKey(key?: string): Promise<void> {
    if (key) {
      const buffer = Buffer.from(key, "base64");
      if (!this.validateKey(buffer)) {
        throw new Error("Неверный формат ключа");
      }
      this.masterKey = buffer;
      return;
    }
  }

  generateKey() {
    return randomBytes(this.KEY_LENGTH);
  }

  isInitialized(): boolean {
    return this.masterKey !== null;
  }

  encryptMaster(data: Buffer): string {
    if (!this.masterKey) throw new Error('Мастер-ключ не инициализирован');
    
    return this.encrypt(this.masterKey, data.toString('base64'));
  }

  decryptMaster(data: string): Buffer {
    if (!this.masterKey) throw new Error('Мастер-ключ не инициализирован');

    return Buffer.from(this.decrypt(this.masterKey, data), 'base64');
  }

  encrypt(key: Buffer, text: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, encrypted, tag]).toString('base64');
  }

  decrypt(key: Buffer, data: string): string {
    const buffer = Buffer.from(data, 'base64');
    const iv = buffer.subarray(0, 12);
    const encrypted = buffer.subarray(12, -16);
    const tag = buffer.subarray(-16);
    
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }

  private validateKey(buffer: Buffer): boolean {
    return buffer.length === this.KEY_LENGTH && timingSafeEqual(buffer, buffer);
  }
}
