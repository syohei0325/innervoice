/**
 * Webhook署名生成（HMAC-SHA256 + timestamp replay protection）
 * 
 * phase1の仕様:
 * - HMAC-SHA256
 * - timestamp を署名対象に含める（replay attack対策）
 * - X-Yohaku-Signature: sha256=<hex>
 * - X-Yohaku-Timestamp: <unix_epoch_seconds>
 * - X-Idempotency-Key: <string>
 * - X-Yohaku-Job-Id: <uuid>
 */

import crypto from 'crypto';

export interface WebhookSignatureResult {
  signature: string;
  timestamp: number;
  headers: {
    'X-Yohaku-Signature': string;
    'X-Yohaku-Timestamp': string;
    'X-Idempotency-Key': string;
    'X-Yohaku-Job-Id': string;
  };
}

/**
 * Webhook署名を生成
 * 
 * @param payload - 送信するペイロード（JSON文字列化前のオブジェクト）
 * @param jobId - Webhook Job ID
 * @param idempotencyKey - 冪等キー
 * @param secret - 署名シークレット（WEBHOOK_SIGNING_SECRET）
 * @returns 署名とヘッダー
 */
export function signWebhook(
  payload: any,
  jobId: string,
  idempotencyKey: string,
  secret: string
): WebhookSignatureResult {
  const timestamp = Math.floor(Date.now() / 1000);
  const payloadString = JSON.stringify(payload);
  
  // 署名対象: timestamp.payload
  // これにより、同じpayloadでもtimestampが変わると署名が変わる（replay対策）
  const signaturePayload = `${timestamp}.${payloadString}`;
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');
  
  return {
    signature: `sha256=${signature}`,
    timestamp,
    headers: {
      'X-Yohaku-Signature': `sha256=${signature}`,
      'X-Yohaku-Timestamp': timestamp.toString(),
      'X-Idempotency-Key': idempotencyKey,
      'X-Yohaku-Job-Id': jobId,
    },
  };
}

/**
 * Webhook署名を検証（受信側で使用）
 * 
 * @param payload - 受信したペイロード（JSON文字列化前のオブジェクト）
 * @param signature - 受信した署名（X-Yohaku-Signature）
 * @param timestamp - 受信したタイムスタンプ（X-Yohaku-Timestamp）
 * @param secret - 署名シークレット（WEBHOOK_SIGNING_SECRET）
 * @param maxSkewSeconds - 許容するタイムスタンプのずれ（デフォルト300秒=5分）
 * @returns 検証結果
 */
export function verifyWebhookSignature(
  payload: any,
  signature: string,
  timestamp: string,
  secret: string,
  maxSkewSeconds: number = 300
): { valid: boolean; reason?: string } {
  // Timestampのスキューチェック（replay attack対策）
  const now = Math.floor(Date.now() / 1000);
  const receivedTimestamp = parseInt(timestamp, 10);
  
  if (isNaN(receivedTimestamp)) {
    return { valid: false, reason: 'Invalid timestamp format' };
  }
  
  const skew = Math.abs(now - receivedTimestamp);
  if (skew > maxSkewSeconds) {
    return { valid: false, reason: `Timestamp skew too large: ${skew}s (max ${maxSkewSeconds}s)` };
  }
  
  // 署名検証
  const payloadString = JSON.stringify(payload);
  const signaturePayload = `${receivedTimestamp}.${payloadString}`;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signaturePayload)
    .digest('hex');
  
  // sha256= プレフィックスを除去
  const receivedSignatureHex = signature.replace(/^sha256=/, '');
  
  // タイミング攻撃対策のため、crypto.timingSafeEqual を使用
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedBuffer = Buffer.from(receivedSignatureHex, 'hex');
  
  if (expectedBuffer.length !== receivedBuffer.length) {
    return { valid: false, reason: 'Signature length mismatch' };
  }
  
  const isValid = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
  
  if (!isValid) {
    return { valid: false, reason: 'Signature verification failed' };
  }
  
  return { valid: true };
}

/**
 * 環境変数からWebhook署名シークレットを取得
 */
export function getWebhookSigningSecret(): string {
  const secret = process.env.WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    throw new Error('WEBHOOK_SIGNING_SECRET is not set');
  }
  return secret;
}

