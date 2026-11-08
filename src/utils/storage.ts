// Safe storage wrapper providing in-memory fallback when localStorage or sessionStorage
// access is blocked (e.g. cross-origin iframes, private browsing, third-party cookie restrictions).

class MemoryStore {
  private data = new Map<string, string>();

  getItem(key: string): string | null {
    return this.data.has(key) ? this.data.get(key)! : null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, String(value));
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }

  key(index: number): string | null {
    const keys = Array.from(this.data.keys());
    return keys[index] ?? null;
  }

  get length(): number {
    return this.data.size;
  }
}

const memoryLocalStorage = new MemoryStore();
const memorySessionStorage = new MemoryStore();

function testStorage(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const storage = window[type];
    if (!storage) return false;
    const testKey = `__probe_${type}__`;
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const hasLocalStorage = testStorage('localStorage');
const hasSessionStorage = testStorage('sessionStorage');

export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (hasLocalStorage) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fall back to memory
      }
    }
    return memoryLocalStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.setItem(key, String(value));
        return;
      } catch {
        // Fall back to memory
      }
    }
    memoryLocalStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        // Fall back to memory
      }
    }
    memoryLocalStorage.removeItem(key);
  },

  clear(): void {
    if (hasLocalStorage) {
      try {
        window.localStorage.clear();
        return;
      } catch {
        // Fall back to memory
      }
    }
    memoryLocalStorage.clear();
  },

  key(index: number): string | null {
    if (hasLocalStorage) {
      try {
        return window.localStorage.key(index);
      } catch {
        // Fall back to memory
      }
    }
    return memoryLocalStorage.key(index);
  },

  get length(): number {
    if (hasLocalStorage) {
      try {
        return window.localStorage.length;
      } catch {
        // Fall back to memory
      }
    }
    return memoryLocalStorage.length;
  }
};

export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (hasSessionStorage) {
      try {
        return window.sessionStorage.getItem(key);
      } catch {
        // Fall back to memory
      }
    }
    return memorySessionStorage.getItem(key);
  },

  setItem(key: string, value: string): void {
    if (hasSessionStorage) {
      try {
        window.sessionStorage.setItem(key, String(value));
        return;
      } catch {
        // Fall back to memory
      }
    }
    memorySessionStorage.setItem(key, value);
  },

  removeItem(key: string): void {
    if (hasSessionStorage) {
      try {
        window.sessionStorage.removeItem(key);
        return;
      } catch {
        // Fall back to memory
      }
    }
    memorySessionStorage.removeItem(key);
  },

  clear(): void {
    if (hasSessionStorage) {
      try {
        window.sessionStorage.clear();
        return;
      } catch {
        // Fall back to memory
      }
    }
    memorySessionStorage.clear();
  },

  key(index: number): string | null {
    if (hasSessionStorage) {
      try {
        return window.sessionStorage.key(index);
      } catch {
        // Fall back to memory
      }
    }
    return memorySessionStorage.key(index);
  },

  get length(): number {
    if (hasSessionStorage) {
      try {
        return window.sessionStorage.length;
      } catch {
        // Fall back to memory
      }
    }
    return memorySessionStorage.length;
  }
};

// Attempt window level patching if window is available
if (typeof window !== 'undefined') {
  if (!hasLocalStorage) {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: safeLocalStorage,
        configurable: true,
        writable: true,
      });
    } catch {
      // In case window.localStorage is non-configurable
    }
  }
  if (!hasSessionStorage) {
    try {
      Object.defineProperty(window, 'sessionStorage', {
        value: safeSessionStorage,
        configurable: true,
        writable: true,
      });
    } catch {
      // In case window.sessionStorage is non-configurable
    }
  }
}

export { safeLocalStorage as localStorage, safeSessionStorage as sessionStorage };
export const safeStorage = safeLocalStorage;
export default safeStorage;
