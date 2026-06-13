/**
 * SSLCommerz Payment Integration
 * Docs: https://developer.sslcommerz.com/doc/v4/
 */

import axios from 'axios';
import crypto from 'crypto';
import qs from 'qs';

const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === 'true';
const BASE_URL = IS_LIVE
  ? 'https://securepay.sslcommerz.com'
  : 'https://sandbox.sslcommerz.com';

export interface SSLCommerzInitParams {
  total_amount: number;
  currency: string;
  tran_id: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1?: string;
  ship_name?: string;
  ship_add1?: string;
  ship_city?: string;
  ship_country?: string;
}

export async function initSSLCommerzPayment(params: SSLCommerzInitParams) {
  const storeId = process.env.SSLCOMMERZ_STORE_ID!;
  const storePasswd = process.env.SSLCOMMERZ_STORE_PASSWD!;

  const payload = {
    store_id: storeId,
    store_passwd: storePasswd,
    ...params,
    success_url: process.env.SSLCOMMERZ_SUCCESS_URL,
    fail_url: process.env.SSLCOMMERZ_FAIL_URL,
    cancel_url: process.env.SSLCOMMERZ_CANCEL_URL,
    ipn_url: process.env.SSLCOMMERZ_IPN_URL,
    emi_option: 0,
    multi_card_name: 'mastercard,visacard,amexcard',
    allowed_bin: '',
    value_a: params.tran_id,
    shipping_method: 'NO',
  };

  const response = await axios.post(
    `${BASE_URL}/gwprocess/v4/api.php`,
    qs.stringify(payload),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  if (response.data.status !== 'SUCCESS') {
    throw new Error(`SSLCommerz init error: ${response.data.failedreason}`);
  }

  return {
    gatewayUrl: response.data.GatewayPageURL,
    sessionKey: response.data.sessionkey,
    transactionId: params.tran_id,
  };
}

export function verifySSLCommerzHash(params: Record<string, string>): boolean {
  const storePasswd = process.env.SSLCOMMERZ_STORE_PASSWD!;
  const receivedHash = params.verify_sign;
  const receivedKey = params.verify_key;

  if (!receivedHash || !receivedKey) return false;

  const keys = receivedKey.split(',');
  const hashString = keys.map((key) => `${key}=${params[key] ?? ''}`).join('&');
  const finalString = `${hashString}&store_passwd=${md5(storePasswd)}`;
  const calculatedHash = md5(finalString);

  return calculatedHash === receivedHash;
}

export async function validateSSLCommerzTransaction(valId: string): Promise<boolean> {
  const storeId = process.env.SSLCOMMERZ_STORE_ID!;
  const storePasswd = process.env.SSLCOMMERZ_STORE_PASSWD!;

  const response = await axios.get(
    `${BASE_URL}/validator/api/validationserverAPI.php`,
    {
      params: {
        val_id: valId,
        store_id: storeId,
        store_passwd: storePasswd,
        format: 'json',
      },
    }
  );

  return response.data.status === 'VALID' || response.data.status === 'VALIDATED';
}

function md5(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}
