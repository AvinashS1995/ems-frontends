import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { CryptoService } from './crypto.service';

type StorageType = 'local' | 'session';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cryptoService: CryptoService) {}

  // // Local Storage
  // setLocal<T>(key: string, value: T): void {
  //   localStorage.setItem(key, JSON.stringify(value));
  // }

  // getLocal<T>(key: string): T | null {
  //   const data = localStorage.getItem(key);
  //   return data ? JSON.parse(data) as T : null;
  // }

  // removeLocal(key: string): void {
  //   localStorage.removeItem(key);
  // }

  // clearLocal(): void {
  //   localStorage.clear();
  // }

  // // Session Storage
  // setSession<T>(key: string, value: T): void {
  //   sessionStorage.setItem(key, JSON.stringify(value));
  // }

  // getSession<T>(key: string): T | null {
  //   const data = sessionStorage.getItem(key);
  //   return data ? JSON.parse(data) as T : null;
  // }

  // removeSession(key: string): void {
  //   sessionStorage.removeItem(key);
  // }

  // clearSession(): void {
  //   sessionStorage.clear();
  // }

  // private getStorage(type: StorageType): Storage {
  //   return type === 'local' ? localStorage : sessionStorage;
  // }

  setItem<T>(key: string, value: T, type: StorageType = 'local'): void {
    this.getStorage(type).setItem(key, JSON.stringify(value));
  }

  getItem<T>(key: string, type: StorageType = 'local'): T | null {
    const item = this.getStorage(type).getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  // removeItem(key: string, type: StorageType = 'local'): void {
  //   this.getStorage(type).removeItem(key);
  // }

  // clear(type: StorageType = 'local'): void {
  //   this.getStorage(type).clear();
  // }

  private getStorage(type: 'local' | 'session'): Storage {
    return type === 'local' ? localStorage : sessionStorage;
  }

  setEncrypted<T>(key: string, value: T, type: 'local' | 'session' = 'local') {
    const encrypted = this.cryptoService.encrypt(value);
    this.getStorage(type).setItem(key, encrypted);
  }

  getDecrypted<T>(key: string, type: 'local' | 'session' = 'local'): T | null {
    const item = this.getStorage(type).getItem(key);
    return item ? this.cryptoService.decrypt<T>(item) : null;
  }

  removeItem(key: string, type: 'local' | 'session') {
    this.getStorage(type).removeItem(key);
  }

  clear(type: 'local' | 'session') {
    this.getStorage(type).clear();
  }
  
}
