import { GreetingData } from '../types';

export const DEFAULT_GREETING: GreetingData = {
  senderName: 'Krishna & Ishwar',
  receiverName: '',
  customMessage: 'May your life shine with happiness, prosperity, peace and endless possibilities.',
  diyaTheme: 'royal-brass',
};

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

  if (token) {
    const decoded = safeBase64Decode(token);
    if (decoded) {
      try {
        const parsed = JSON.parse(decoded);
        return {
          senderName: parsed.s || parsed.senderName || DEFAULT_GREETING.senderName,
          receiverName: parsed.r || parsed.receiverName || '',
          customMessage: parsed.m || parsed.customMessage || DEFAULT_GREETING.customMessage,
          diyaTheme: parsed.t || parsed.diyaTheme || 'royal-brass',
        };
      } catch {
        return {
          ...DEFAULT_GREETING,
          senderName: decoded,
        };
      }
    }
  }

  // 2. Check query params: ?from= or ?s=, ?to= or ?r=, ?msg= or ?m=
  const sender = searchParams.get('from') || searchParams.get('s') || searchParams.get('sender');
  const receiver = searchParams.get('to') || searchParams.get('r') || searchParams.get('receiver');
  const message = searchParams.get('msg') || searchParams.get('m') || searchParams.get('message');
  const theme = searchParams.get('theme') as GreetingData['diyaTheme'];

  if (sender) {
    return {
      senderName: sender.trim(),
      receiverName: receiver ? receiver.trim() : '',
      customMessage: message ? message.trim() : DEFAULT_GREETING.customMessage,
      diyaTheme: theme || 'royal-brass',
    };
  }

  return DEFAULT_GREETING;
}

export function generateGreetingUrl(data: GreetingData): string {
  if (typeof window === 'undefined') return '';
  const baseUrl = `${window.location.origin}${window.location.pathname}`;

  const payload = {
    s: data.senderName.trim(),
    r: data.receiverName?.trim() || undefined,
    m: data.customMessage?.trim() || undefined,
    t: data.diyaTheme || 'royal-brass',
  };

  const encoded = safeBase64Encode(JSON.stringify(payload));
  return `${baseUrl}?w=${encodeURIComponent(encoded)}`;
}

/**
 * Universal Festive WhatsApp share text
 */
export function generateWhatsAppShareText(data: GreetingData, url: string): string {
  const receiverGreeting = data.receiverName ? `Dear *${data.receiverName}*,\n\n` : '';
  const personalMsg = data.customMessage
    ? `_"${data.customMessage}"_\n\n`
    : `_May your life shine with happiness, prosperity, peace and endless possibilities._\n\n`;

  return `🪔✨ *HAPPY DIWALI!* ✨🪔\n\n${receiverGreeting}*${data.senderName}* has lit a sacred Diwali Diya for you ✨\n\n${personalMsg}🎁 *Open your cinematic Diwali gift here:*\n${url}\n\n_Happy Diwali from ${data.senderName}!_ 🪔✨`;
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
  if (typeof navigator !== 'undefined' && 'share' in navigator) {
    try {
      await navigator.share({
        title: `Diwali Diya from ${data.senderName} ✨ Happy Diwali!`,
        text: `🪔 ${data.senderName} has lit a sacred Diwali Diya for you. May your year be filled with radiant joy and prosperity!`,
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
 * Direct WhatsApp one-click trigger
 */
export function openWhatsAppShare(data: GreetingData, url: string) {
  const text = generateWhatsAppShareText(data, url);
  // Universal WhatsApp deep-link that works on iOS, Android, and Desktop WhatsApp Web
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}
