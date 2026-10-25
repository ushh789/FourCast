import { STORAGE_KEYS } from '../config';

class TokenStorageService {
  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private safeGetItem(key: string): string | null {
    if (!this.isClient()) return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`[Storage] Failed to get item "${key}":`, error);
      return null;
    }
  }

  private safeSetItem(key: string, value: string): boolean {
    if (!this.isClient()) return false;

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`[Storage] Failed to set item "${key}":`, error);
      return false;
    }
  }

  private safeRemoveItem(key: string): boolean {
    if (!this.isClient()) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[Storage] Failed to remove item "${key}":`, error);
      return false;
    }
  }

  getAccessToken(): string | null {
    const token = this.safeGetItem(STORAGE_KEYS.ACCESS_TOKEN);
    return this.isValidToken(token) ? token : null;
  }

  setAccessToken(token: string): boolean {
    if (!this.isValidToken(token)) {
      console.warn('[Storage] Invalid access token format');
      return false;
    }
    return this.safeSetItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getRefreshToken(): string | null {
    const token = this.safeGetItem(STORAGE_KEYS.REFRESH_TOKEN);
    return this.isValidToken(token) ? token : null;
  }

  setRefreshToken(token: string): boolean {
    if (!this.isValidToken(token)) {
      console.warn('[Storage] Invalid refresh token format');
      return false;
    }
    return this.safeSetItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  setTokens(accessToken: string, refreshToken: string): boolean {
    const accessSet = this.setAccessToken(accessToken);
    const refreshSet = this.setRefreshToken(refreshToken);
    return accessSet && refreshSet;
  }

  clearTokens(): boolean {
    const accessCleared = this.safeRemoveItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshCleared = this.safeRemoveItem(STORAGE_KEYS.REFRESH_TOKEN);
    return accessCleared && refreshCleared;
  }

  hasValidAccessToken(): boolean {
    return this.getAccessToken() !== null;
  }


  private isValidToken(token: string | null): boolean {
    if (!token || typeof token !== 'string') return false;
    // JWT has 3 parts separated by dots
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  getUser<T = Record<string, unknown>>(): T | null {
    const user = this.safeGetItem(STORAGE_KEYS.USER);
    if (!user) return null;

    try {
      return JSON.parse(user) as T;
    } catch (error) {
      console.error('[Storage] Failed to parse user data:', error);
      this.safeRemoveItem(STORAGE_KEYS.USER);
      return null;
    }
  }

  setUser<T = Record<string, unknown>>(user: T | null): boolean {
    if (!user) {
      return this.safeRemoveItem(STORAGE_KEYS.USER);
    }

    try {
      return this.safeSetItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('[Storage] Failed to stringify user data:', error);
      return false;
    }
  }

  clearAll(): boolean {
    const tokensCleared = this.clearTokens();
    const userCleared = this.safeRemoveItem(STORAGE_KEYS.USER);
    return tokensCleared && userCleared;
  }
}

export const tokenStorage = new TokenStorageService();
