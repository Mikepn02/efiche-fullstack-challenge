let inMemoryToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

// Use public env vars if provided, else fall back to sane defaults
const LOCAL_STORAGE_KEY = process.env.NEXT_PUBLIC_LOCAL_STORAGE_KEY || 'app_token_enc';
const REFRESH_LOCAL_STORAGE_KEY = process.env.NEXT_PUBLIC_REFRESH_LOCAL_STORAGE_KEY || 'app_refresh_token_enc';
const SESSION_KEY_KEY = process.env.NEXT_PUBLIC_SESSION_KEY_KEY || 'app_token_key';

async function getCryptoKey(): Promise<CryptoKey | null> {
  const keyB64 = sessionStorage.getItem(SESSION_KEY_KEY);
  if (!keyB64) return null;
  const raw = Uint8Array.from(atob(keyB64), c => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'raw',
    raw,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

async function ensureCryptoKey(): Promise<CryptoKey> {
  const existing = await getCryptoKey();
  if (existing) return existing;
  const raw = new Uint8Array(32);
  crypto.getRandomValues(raw);
  const key = await crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  sessionStorage.setItem(SESSION_KEY_KEY, b64);
  return key;
}

export async function setToken(token: string, persist = false): Promise<void> {
  inMemoryToken = token;
  if (persist && typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const key = await ensureCryptoKey();
      const iv = new Uint8Array(12);
      crypto.getRandomValues(iv);
      const enc = new TextEncoder().encode(token);
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc);
      const payload = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(cipher)),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Fallback without encryption
      localStorage.setItem(LOCAL_STORAGE_KEY, token);
    }
  }
  // Also set a cookie so Next middleware can read it for redirects
  if (typeof document !== 'undefined') {
    // Try to derive expiry from JWT exp; fallback to a short session cookie
    let maxAge: number | undefined;
    try {
      const payloadPart = token.split('.')[1];
      if (payloadPart) {
        const json = JSON.parse(atob(payloadPart));
        if (json?.exp && typeof json.exp === 'number') {
          const secondsLeft = json.exp - Math.floor(Date.now() / 1000);
          if (secondsLeft > 0) maxAge = secondsLeft;
        }
      }
    } catch {}
    const attrs = [
      'path=/',
      'samesite=Lax',
      // secure on HTTPS; keep consistent with edge expectations
      window.location.protocol === 'https:' ? 'secure' : ''
    ].filter(Boolean);
    if (maxAge) attrs.push(`max-age=${Math.min(maxAge, 60 * 60 * 24 * 7)}`); // cap at 7 days
    document.cookie = `access_token=${encodeURIComponent(token)}; ${attrs.join('; ')}`;
  }
}

export function getTokenSync(): string | null {
  return inMemoryToken;
}

export async function hydrateTokenFromStorage(): Promise<string | null> {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.iv && parsed?.data) {
      const key = await getCryptoKey();
      if (!key) return null;
      const iv = new Uint8Array(parsed.iv);
      const data = new Uint8Array(parsed.data);
      const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      const token = new TextDecoder().decode(plainBuf);
      inMemoryToken = token;
      return token;
    }
    // Fallback plaintext
    inMemoryToken = stored;
    return stored;
  } catch {
    // Not JSON; treat as plaintext
    inMemoryToken = stored;
    return stored;
  }
}

export async function setRefreshToken(token: string, persist = false): Promise<void> {
  inMemoryRefreshToken = token;
  if (persist && typeof window !== 'undefined' && window.crypto?.subtle) {
    try {
      const key = await ensureCryptoKey();
      const iv = new Uint8Array(12);
      crypto.getRandomValues(iv);
      const enc = new TextEncoder().encode(token);
      const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc);
      const payload = { iv: Array.from(iv), data: Array.from(new Uint8Array(cipher)) };
      localStorage.setItem(REFRESH_LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      localStorage.setItem(REFRESH_LOCAL_STORAGE_KEY, token);
    }
  }
}

export function getRefreshTokenSync(): string | null {
  return inMemoryRefreshToken;
}

export async function hydrateRefreshTokenFromStorage(): Promise<string | null> {
  if (inMemoryRefreshToken) return inMemoryRefreshToken;
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(REFRESH_LOCAL_STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (parsed?.iv && parsed?.data) {
      const key = await getCryptoKey();
      if (!key) return null;
      const iv = new Uint8Array(parsed.iv);
      const data = new Uint8Array(parsed.data);
      const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      const token = new TextDecoder().decode(plainBuf);
      inMemoryRefreshToken = token;
      return token;
    }
    inMemoryRefreshToken = stored;
    return stored;
  } catch {
    inMemoryRefreshToken = stored;
    return stored;
  }
}

export function clearToken(): void {
  inMemoryToken = null;
  inMemoryRefreshToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(REFRESH_LOCAL_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY_KEY);
    // Clear cookie used by middleware
    try {
      const attrs = ['path=/', 'samesite=Lax', window.location.protocol === 'https:' ? 'secure' : ''].filter(Boolean);
      document.cookie = `access_token=; max-age=0; ${attrs.join('; ')}`;
    } catch {}
  }
}


