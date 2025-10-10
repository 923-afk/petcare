import CryptoJS from 'crypto-js';

// Get encryption key from environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';

if (ENCRYPTION_KEY === 'default-key-change-in-production') {
  console.warn('⚠️  Using default encryption key. Set ENCRYPTION_KEY in .env for production!');
}

/**
 * Encrypts sensitive medical data using AES-256 encryption
 * @param plaintext - The text to encrypt
 * @returns Encrypted text as base64 string
 */
export function encryptMedicalData(plaintext: string): string {
  if (!plaintext) return '';
  
  try {
    const encrypted = CryptoJS.AES.encrypt(plaintext, ENCRYPTION_KEY);
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt medical data');
  }
}

/**
 * Decrypts encrypted medical data
 * @param ciphertext - The encrypted text to decrypt
 * @returns Decrypted plaintext string
 */
export function decryptMedicalData(ciphertext: string): string {
  if (!ciphertext) return '';
  
  try {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt medical data');
  }
}

/**
 * Generates a secure random encryption key (use this to generate ENCRYPTION_KEY)
 * Run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 */
export function generateEncryptionKey(): string {
  // This uses crypto-js's random generator
  const randomWords = CryptoJS.lib.WordArray.random(32);
  return randomWords.toString(CryptoJS.enc.Hex);
}

