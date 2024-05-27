import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Save data to localStorage
  saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Retrieve data from localStorage
  getData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data? JSON.parse(data) : null;
  }

  // Remove data from localStorage
  removeData(key: string): void {
    localStorage.removeItem(key);
  }
}
