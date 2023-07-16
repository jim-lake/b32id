const crypto = require('node:crypto');

const BASE32 = '0123456789abcdefghjkmnpqrtuvwxyz';

exports.BASE32 = BASE32;
exports.rng = rng;
exports.id = id;
exports.decode = decode;
exports.encode = encode;

const POOL_SIZE = 256 * 8 * 16;

const g_rngPool = Buffer.alloc(POOL_SIZE);
let g_poolPtr = g_rngPool.length;
function rng(length = 16) {
  if (g_poolPtr > g_rngPool.length - length) {
    crypto.randomFillSync(g_rngPool);
    g_poolPtr = 0;
  }
  return g_rngPool.slice(g_poolPtr, (g_poolPtr += length));
}

function id(length = 16) {
  return encode(rng(length));
}

function decode(input) {
  const ret = Buffer.alloc(Math.floor((input.length * 5) / 8));
  let bits = 0;
  let j = 0;
  let temp = 0;
  for (let i = 0; i < input.length; i++) {
    if (bits >= 8) {
      ret[j++] = temp & 0xff;
      bits -= 8;
      temp >>= 8;
    }

    const val = BASE32.indexOf(input[i]);
    if (val !== -1) {
      temp += val << bits;
      bits += 5;
    } else {
      throw new Error('bad character');
    }
  }
  if (bits && j < ret.length) {
    ret[j] = temp;
  }
  return ret;
}
function encode(input) {
  let s = '';
  let bits = 0;
  let num = 0;
  let i = 0;
  while (true) {
    if (bits < 5) {
      if (i >= input.length) {
        break;
      }
      num += input[i] << bits;
      bits += 8;
      i += 1;
    }
    s += BASE32[num & 0x1f];
    num >>= 5;
    bits -= 5;
  }
  if (bits > 0) {
    s += BASE32[num & 0x1f];
  }
  return s;
}
