/**
 * Webhook Validator - 任意URL送信を防ぐ（SSRF対策）
 * 
 * phase1の安全性:
 * - Webhook target は connector_configs に事前登録
 * - /confirm 実行時は 登録済みconnector_id しか使えない
 * - devだけ localhost を許す（DEV_ALLOW_LOCALHOST=true）
 */

import crypto from 'crypto';

const DEV_ALLOW_LOCALHOST = process.env.DEV_ALLOW_LOCALHOST === 'true';
const ALLOWED_DOMAINS = process.env.WEBHOOK_ALLOWED_DOMAINS?.split(',') || [];

/**
 * Webhook URLが安全かチェック
 */
export function validateWebhookUrl(url: string): { valid: boolean; reason?: string } {
  try {
    const parsed = new URL(url);

    // 1. HTTPSのみ許可（devではhttpも許可）
    if (parsed.protocol !== 'https:' && !(DEV_ALLOW_LOCALHOST && parsed.protocol === 'http:')) {
      return { valid: false, reason: 'Only HTTPS is allowed (or HTTP for localhost in dev)' };
    }

    // 2. localhost/127.0.0.1 は dev のみ許可
    const isLocalhost = 
      parsed.hostname === 'localhost' ||
      parsed.hostname === '127.0.0.1' ||
      parsed.hostname.startsWith('192.168.') ||
      parsed.hostname.startsWith('10.') ||
      parsed.hostname.startsWith('172.');

    if (isLocalhost && !DEV_ALLOW_LOCALHOST) {
      return { valid: false, reason: 'Localhost is not allowed in production' };
    }

    // 3. プライベートIPアドレスを禁止（SSRF対策）
    if (!isLocalhost && isPrivateIP(parsed.hostname)) {
      return { valid: false, reason: 'Private IP addresses are not allowed' };
    }

    // 4. 許可ドメインリストがある場合はチェック
    if (ALLOWED_DOMAINS.length > 0) {
      const isAllowed = ALLOWED_DOMAINS.some(domain => 
        parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) {
        return { valid: false, reason: `Domain ${parsed.hostname} is not in allowlist` };
      }
    }

    return { valid: true };

  } catch (err) {
    return { valid: false, reason: 'Invalid URL format' };
  }
}

/**
 * プライベートIPアドレスかチェック
 */
function isPrivateIP(hostname: string): boolean {
  // IPv4プライベートアドレス範囲
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./, // Link-local
    /^::1$/, // IPv6 localhost
    /^fe80:/i, // IPv6 link-local
    /^fc00:/i, // IPv6 unique local
  ];

  return privateRanges.some(range => range.test(hostname));
}

/**
 * Webhook target URLのハッシュを生成
 */
export function hashWebhookUrl(url: string): string {
  return crypto.createHash('sha256').update(url).digest('hex');
}

/**
 * Connector Configから登録済みWebhook URLを取得
 */
export interface WebhookConfig {
  connector_id: string;
  target_url: string;
  target_url_hash: string;
  enabled: boolean;
}

/**
 * Webhook送信前の最終チェック
 */
export function validateWebhookExecution(
  targetUrl: string,
  registeredConfigs: WebhookConfig[]
): { allowed: boolean; reason?: string; config?: WebhookConfig } {
  // 1. URL形式チェック
  const urlValidation = validateWebhookUrl(targetUrl);
  if (!urlValidation.valid) {
    return { allowed: false, reason: urlValidation.reason };
  }

  // 2. 登録済みかチェック
  const targetHash = hashWebhookUrl(targetUrl);
  const config = registeredConfigs.find(c => c.target_url_hash === targetHash);

  if (!config) {
    return { 
      allowed: false, 
      reason: 'Webhook target URL is not registered. Please register it in connector_configs first.' 
    };
  }

  // 3. 有効化されているかチェック
  if (!config.enabled) {
    return { 
      allowed: false, 
      reason: 'Webhook connector is disabled' 
    };
  }

  return { allowed: true, config };
}










