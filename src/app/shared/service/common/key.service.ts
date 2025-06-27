import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyService {

  private key: string | null = null;
  private readonly keyName = 'sessionKey';

  setKey(key: string) {
    this.key = key;
    sessionStorage.setItem(this.keyName, key);
  }

  getKey(): string | null {
    return this.key || sessionStorage.getItem(this.keyName);
  }

  clearKey() {
    this.key = null;
    sessionStorage.removeItem(this.keyName);
  }
}
