/**
 * bKash Payment Integration
 * API Version: v1.2.0-beta (Tokenized Checkout)
 * Docs: https://developer.bka.sh/docs
 */

import axios from 'axios';

const BASE_URL = process.env.BKASH_BASE_URL || 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

interface BkashTokenResponse {
  statusCode: string;
  statusMessage: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
}

interface BkashCreatePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  bkashURL: string;
  callbackURL: string;
  successCallbackURL: string;
  failureCallbackURL: string;
  cancelledCallbackURL: string;
  amount: string;
  intent: string;
  currency: string;
  paymentCreateTime: string;
  transactionStatus: string;
  merchantInvoiceNumber: string;
}

interface BkashExecutePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  trxID: string;
  transactionStatus: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  paymentExecuteTime: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const response = await axios.post<BkashTokenResponse>(
    `${BASE_URL}/tokenized/checkout/token/grant`,
    {
      app_key: process.env.BKASH_APP_KEY,
      app_secret: process.env.BKASH_APP_SECRET,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        username: process.env.BKASH_USERNAME!,
        password: process.env.BKASH_PASSWORD!,
      },
    }
  );

  if (response.data.statusCode !== '0000') {
    throw new Error(`bKash token error: ${response.data.statusMessage}`);
  }

  cachedToken = {
    token: response.data.id_token,
    expiresAt: Date.now() + (response.data.expires_in - 60) * 1000, // 60s buffer
  };

  return cachedToken.token;
}

export async function createBkashPayment(params: {
  amount: number;
  invoiceNumber: string;
  intent?: 'sale' | 'authorization';
}): Promise<BkashCreatePaymentResponse> {
  const token = await getToken();

  const response = await axios.post<BkashCreatePaymentResponse>(
    `${BASE_URL}/tokenized/checkout/create`,
    {
      mode: '0011',
      payerReference: params.invoiceNumber,
      callbackURL: process.env.BKASH_CALLBACK_URL,
      amount: params.amount.toString(),
      currency: 'BDT',
      intent: params.intent ?? 'sale',
      merchantInvoiceNumber: params.invoiceNumber,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-App-Key': process.env.BKASH_APP_KEY!,
      },
    }
  );

  if (response.data.statusCode !== '0000') {
    throw new Error(`bKash create payment error: ${response.data.statusMessage}`);
  }

  return response.data;
}

export async function executeBkashPayment(
  paymentId: string
): Promise<BkashExecutePaymentResponse> {
  const token = await getToken();

  const response = await axios.post<BkashExecutePaymentResponse>(
    `${BASE_URL}/tokenized/checkout/execute`,
    { paymentID: paymentId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-App-Key': process.env.BKASH_APP_KEY!,
      },
    }
  );

  if (!['0000', '0', '200'].includes(response.data.statusCode)) {
    throw new Error(`bKash execute error: ${response.data.statusMessage}`);
  }

  return response.data;
}

export async function queryBkashPayment(paymentId: string) {
  const token = await getToken();

  const response = await axios.post(
    `${BASE_URL}/tokenized/checkout/payment/status`,
    { paymentID: paymentId },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-App-Key': process.env.BKASH_APP_KEY!,
      },
    }
  );

  return response.data;
}

export async function refundBkashPayment(params: {
  paymentId: string;
  trxId: string;
  amount: number;
  reason: string;
}) {
  const token = await getToken();

  const response = await axios.post(
    `${BASE_URL}/tokenized/checkout/payment/refund`,
    {
      paymentID: params.paymentId,
      trxID: params.trxId,
      amount: params.amount.toString(),
      currency: 'BDT',
      reason: params.reason,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        'X-App-Key': process.env.BKASH_APP_KEY!,
      },
    }
  );

  return response.data;
}
