/**
 * Small, synchronous SHA-256 implementation (pure JS) used to hash passwords
 * and verification codes before they are stored in the local database.
 * NOTE: in production, password hashing must happen on a real backend.
 */
const K = new Uint32Array(64);
const H0 = new Uint32Array(8);

(function initConstants() {
  const primes = [];
  let n = 2;
  while (primes.length < 64) {
    if (primes.every((p) => n % p !== 0)) primes.push(n);
    n += 1;
  }
  const frac = (x) => ((x - Math.floor(x)) * 4294967296) >>> 0;
  for (let i = 0; i < 8; i += 1) H0[i] = frac(Math.sqrt(primes[i]));
  for (let i = 0; i < 64; i += 1) K[i] = frac(Math.cbrt(primes[i]));
})();

const rotr = (x, n) => (x >>> n) | (x << (32 - n));

export function sha256(message) {
  const bytes = new TextEncoder().encode(String(message));
  const length = bytes.length;
  const paddedLength = ((length + 9 + 63) >> 6) << 6;
  const buffer = new Uint8Array(paddedLength);
  buffer.set(bytes);
  buffer[length] = 0x80;
  const view = new DataView(buffer.buffer);
  const bitLength = length * 8;
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 4294967296));
  view.setUint32(paddedLength - 4, bitLength >>> 0);

  const H = Array.from(H0);
  const W = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let t = 0; t < 16; t += 1) W[t] = view.getUint32(offset + t * 4);
    for (let t = 16; t < 64; t += 1) {
      const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    H[0] = (H[0] + a) >>> 0;
    H[1] = (H[1] + b) >>> 0;
    H[2] = (H[2] + c) >>> 0;
    H[3] = (H[3] + d) >>> 0;
    H[4] = (H[4] + e) >>> 0;
    H[5] = (H[5] + f) >>> 0;
    H[6] = (H[6] + g) >>> 0;
    H[7] = (H[7] + h) >>> 0;
  }

  return H.map((x) => x.toString(16).padStart(8, '0')).join('');
}

export function randomHex(byteCount = 16) {
  const bytes = new Uint8Array(byteCount);
  if (globalThis.crypto && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < byteCount; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function hashPassword(password, salt) {
  return sha256(`${salt}:${password}`);
}

/** 6-digit numeric code, e.g. "048213". */
export function randomCode() {
  const value = parseInt(randomHex(4), 16) % 1000000;
  return String(value).padStart(6, '0');
}
