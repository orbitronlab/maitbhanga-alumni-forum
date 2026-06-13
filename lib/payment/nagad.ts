/**
 * Nagad Payment Integration
 * Docs: https://nagad.com.bd/merchant-api
 */

import axios from 'axios';
import crypto from 'crypto';

const BASE_URL =
  process.env.NAGAD_BASE_URL ||
  'https://sandbox.mynagad.com:10080/remote-payment-gateway-1.0';

function encrypt(data: string, publicKey: string): string {
  const buffer = Buffer.from(data);
  const encrypted = crypto.publicEncrypt(
    {
      key: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    buffer
  );
  return encrypted.toString('base64');
}

function sign(data: string, privateKey: string): string {
  const sign = crypto.createSign('SHA256');
  sign.update(data);
  return sign.sign(
    `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`,
    'base64'
  );
}

function generateDatetime(): string {
  return new Date()
    .toISOString()
    .replace('T', '')
    .replace(/\..+/, '')
    .replace(/-/g, '')
    .replace(/:/g, '');
}

export async function initializeNagadPayment(params: {
  orderId: string;
  amount: number;
  callbackUrl: string;
}) {
  const merchantId = process.env.NAGAD_MERCHANT_ID!;
  const privateKey = process.env.NAGAD_MERCHANT_PRIVATE_KEY!;
  const publicKey = process.env.NAGAD_PUBLIC_KEY!;
  const datetime = generateDatetime();

  const sensitiveData = {
    merchantId,
    datetime,
    orderId: params.orderId,
    challenge: crypto.randomBytes(20).toString('hex'),
  };

  const encryptedSensitiveData = encrypt(JSON.stringify(sensitiveData), publicKey);
  const signature = sign(JSON.stringify(sensitiveData), privateKey);

  const initResponse = await axios.post(
    `${BASE_URL}/api/dfs/check-out/initialize/${merchantId}/${params.orderId}`,
    {
      accountNumber: merchantId,
      datetime,
      sensitiveData: encryptedSensitiveData,
      signature,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-KM-Api-Version': 'v-0.2.0',
        'X-KM-IP-V4': '127.0.0.1',
        'X-KM-Client-Type': 'PC_WEB',
      },
    }
  );

  const { sensitiveData: encResponse, signature: sigResponse } = initResponse.data;

  // Complete checkout
  const completeData = {
    merchantId,
    orderId: params.orderId,
    currencyCode: '050', // BDT
    amount: params.amount.toString(),
    challenge: sensitiveData.challenge,
  };

  const encryptedCompleteData = encrypt(JSON.stringify(completeData), publicKey);
  const completeSignature = sign(JSON.stringify(completeData), privateKey);

  const completeResponse = await axios.post(
    `${BASE_URL}/api/dfs/check-out/complete/${merchantId}/${params.orderId}`,
    {
      sensitiveData: encryptedCompleteData,
      signature: completeSignature,
      merchantCallbackURL: params.callbackUrl,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-KM-Api-Version': 'v-0.2.0',
        'X-KM-IP-V4': '127.0.0.1',
        'X-KM-Client-Type': 'PC_WEB',
      },
    }
  );

  return completeResponse.data;
}

export async function verifyNagadPayment(paymentRefId: string) {
  const merchantId = process.env.NAGAD_MERCHANT_ID!;

  const response = await axios.get(
    `${BASE_URL}/api/dfs/verify/payment/${paymentRefId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        'X-KM-Api-Version': 'v-0.2.0',
        'X-KM-IP-V4': '127.0.0.1',
        'X-KM-Client-Type': 'PC_WEB',
      },
    }
  );

  return response.data;
}
