import { Injectable } from '@angular/core';
import { KeyService } from './key.service';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  constructor(private keyService: KeyService,) { }

  encrypt<T>(value: T): string {
      const key = this.keyService.getKey();
      if (!key) throw new Error('Encryption key is not set');
  
      const text = JSON.stringify(value);
      return AES.encrypt(text, key).toString();
    }
  
    decrypt<T>(encrypted: string): T | null {
      const key = this.keyService.getKey();
  
      if (!key) {
        throw new Error('Decryption key is not set');
      }
  
      try {
        const bytes = AES.decrypt(encrypted, key);
        const decryptedText = bytes.toString(Utf8);
        return JSON.parse(decryptedText) as T;
      } catch (e) {
        console.warn('Decryption failed:', e);
        return null;
      }
    }
}
