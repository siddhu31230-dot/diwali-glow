import { GreetingData } from '../types';

export const DEFAULT_GREETING: GreetingData = {
  senderName: 'Krishna & Ishwar',
  receiverName: '',
  customMessage: 'May your life shine with happiness, prosperity, peace and endless possibilities.',
  diyaTheme: 'royal-brass',
};

/**
 * Security: Strip dangerous control characters, bidi overrides, zero-width chars, and enforce length limits
 */
export function sanitizeInput(input: unknown, maxLength: number, fallback = ''): string {
  if (typeof input !== 'string') return fallback;
  // Remove control characters (ASCII 0-31 & 127-159), bidi overrides (U+202A-202E, U+2066-2069), zero-width characters (U+200B-200D, U+FEFF)
  const cleaned = input
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
    .trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Security: Strict whitelist for Diya visual theme
 */
export function validateDiyaTheme(theme: unknown): GreetingData['diyaTheme'] {
  const allowed: GreetingData['diyaTheme'][] = ['classic', 'royal-brass', 'terracotta'];
  if (typeof theme === 'string' && (allowed as string[]).includes(theme)) {
    return theme as GreetingData['diyaTheme'];
  }
  return 'royal-brass';
}

// Safe UTF-8 Base64 encode & decode
export function safeBase64Encode(str: string): string {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
  } catch {
    return btoa(str);
  }
}

export function safeBase64Decode(str: string): string {
  try {
    return decodeURIComponent(
      atob(str)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    try {
      return atob(str);
    } catch {
      return '';
    }
  }
}

export function parseGreetingFromUrl(): GreetingData {
  if (typeof window === 'undefined') return DEFAULT_GREETING;

  try {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    // 1. Check if path has /w/BASE64_TOKEN or query has ?w=BASE64_TOKEN
    let token = searchParams.get('w');
    if (!token) {
      const pathSegments = window.location.pathname.split('/');
      const wIndex = pathSegments.indexOf('w');
      if (wIndex !== -1 && pathSegments[wIndex + 1]) {
        token = pathSegments[wIndex + 1];
      }
    }

    // Security: Guard against token flood DoS (max 4096 chars)
    if (token && token.length <= 4096) {
      const decoded = safeBase64Decode(token);
      if (decoded) {
        try {
          const parsed = JSON.parse(decoded);
          if (parsed && typeof parsed === 'object') {
            const s = sanitizeInput(parsed.s || parsed.senderName, 60, DEFAULT_GREETING.senderName);
            const r = sanitizeInput(parsed.r || parsed.receiverName, 60, '');
            const m = sanitizeInput(parsed.m || parsed.customMessage, 300, DEFAULT_GREETING.customMessage);
            const t = validateDiyaTheme(parsed.t || parsed.diyaTheme);
            return {
              senderName: s || DEFAULT_GREETING.senderName,
              receiverName: r,
              customMessage: m || DEFAULT_GREETING.customMessage,
              diyaTheme: t,
            };
          }
        } catch {
          // Fallback if token was raw string
          const s = sanitizeInput(decoded, 60, DEFAULT_GREETING.senderName);
          return {
            ...DEFAULT_GREETING,
            senderName: s || DEFAULT_GREETING.senderName,
          };
        }
      }
    }

    // 2. Check query params: ?from= or ?s=, ?to= or ?r=, ?msg= or ?m=
    const sender = searchParams.get('from') || searchParams.get('s') || searchParams.get('sender');
    const receiver = searchParams.get('to') || searchParams.get('r') || searchParams.get('receiver');
    const message = searchParams.get('msg') || searchParams.get('m') || searchParams.get('message');
    const theme = searchParams.get('theme');

    if (sender) {
      const s = sanitizeInput(sender, 60, DEFAULT_GREETING.senderName);
      const r = sanitizeInput(receiver, 60, '');
      const m = sanitizeInput(message, 300, DEFAULT_GREETING.customMessage);
      const t = validateDiyaTheme(theme);
      return {
        senderName: s || DEFAULT_GREETING.senderName,
        receiverName: r,
        customMessage: m || DEFAULT_GREETING.customMessage,
        diyaTheme: t,
      };
    }
  } catch (err) {
    console.warn('Safe URL parsing fallback triggered:', err);
  }

  return DEFAULT_GREETING;
}

export function generateGreetingUrl(data: GreetingData): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin + window.location.pathname);

  const payload = {
    s: sanitizeInput(data.senderName, 60, DEFAULT_GREETING.senderName),
    r: data.receiverName ? sanitizeInput(data.receiverName, 60) : undefined,
    m: data.customMessage ? sanitizeInput(data.customMessage, 300) : undefined,
    t: validateDiyaTheme(data.diyaTheme),
  };

  const encoded = safeBase64Encode(JSON.stringify(payload));
  url.searchParams.set('w', encoded);
  return url.toString();
}

/**
 * Updates browser URL in place without page reload
 */
export function updateBrowserUrl(data: GreetingData) {
  if (typeof window === 'undefined') return;
  const newUrl = generateGreetingUrl(data);
  window.history.replaceState(null, '', newUrl);
}

/**
 * Universal Festive WhatsApp share text
 */
export function generateWhatsAppShareText(data: GreetingData, url: string): string {
  const safeSender = sanitizeInput(data.senderName, 60, DEFAULT_GREETING.senderName);
  const safeReceiver = data.receiverName ? sanitizeInput(data.receiverName, 60) : '';
  const safeMessage = data.customMessage
    ? sanitizeInput(data.customMessage, 300)
    : 'May your life shine with happiness, prosperity, peace and endless possibilities.';

  const receiverGreeting = safeReceiver ? `Dear *${safeReceiver}*,\n\n` : '';
  const personalMsg = `_"${safeMessage}"_\n\n`;

  return `🪔✨ *HAPPY DIWALI!* ✨🪔\n\n${receiverGreeting}*${safeSender}* has lit a sacred Diwali Diya for you ✨\n\n${personalMsg}🎁 *Open your cinematic Diwali gift here:*\n${url}\n\n_Happy Diwali from ${safeSender}!_ 🪔✨`;
}

/**
 * Robust copy to clipboard for all devices (Android, iPhone, iPad, Desktop, Webviews)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Method 1: Modern navigator.clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to fallback
    }
  }

  // Method 2: Document execCommand fallback (works on non-HTTPS, iOS Safari webviews, older browsers)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}

/**
 * Native Web Share API helper for iOS, Android and supported desktop browsers
 */
export async function shareGreetingNative(
  data: GreetingData,
  url: string
): Promise<'shared' | 'fallback_needed' | 'cancelled'> {
  // Validate URL scheme
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = window.location.href;
  }

  const safeSender = sanitizeInput(data.senderName, 60, DEFAULT_GREETING.senderName);

  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({
        title: `Diwali Diya from ${safeSender} ✨ Happy Diwali!`,
        text: `🪔 ${safeSender} has lit a sacred Diwali Diya for you. May your year be filled with radiant joy and prosperity!`,
        url,
      });
      return 'shared';
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return 'cancelled';
      }
      return 'fallback_needed';
    }
  }
  return 'fallback_needed';
}

/**
 * Direct WhatsApp one-click trigger with validated URL
 */
export function openWhatsAppShare(data: GreetingData, url: string) {
  // Validate URL scheme to prevent open redirect or script injection
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = window.location.href;
  }
  const text = generateWhatsAppShareText(data, url);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}
