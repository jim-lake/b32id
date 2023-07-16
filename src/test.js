const crypto = require('crypto');

const { BASE32, id, rng, encode, decode } = require('./index');

const MILLION = 1000 * 1000;

console.log('');
_showTest('nums', Buffer.from('0123456789abcdef0123456789abcdef', 'hex'));
console.log('');
_showTest("0x00's", Buffer.from('00000000000000000000000000000000', 'hex'));
console.log('');
_showTest("0xff's", Buffer.from('ffffffffffffffffffffffffffffffff', 'hex'));
console.log('');
_showTest("0x55's", Buffer.from('55555555555555555555555555555555', 'hex'));
console.log('');
_showTest("0xaa's", Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'));
console.log('');
_showTest('0x01', Buffer.from('01', 'hex'));

console.log();
_expect(
  Buffer.from('0123456789abcdef0123456789abcdef', 'hex'),
  '1r8amk5hbdkzy0c45utjrnptf7'
);

console.log();
_expect(
  Buffer.from('76812347137813796513768136786136', 'hex'),
  'pb07j3d2rv4jqjd2pb0d3w5cp1'
);

console.log();
_test(rng(8), true);
_test(rng(8), true);
_test(rng(16), true);
_test(rng(16), true);
_test(rng(32), true);
_test(rng(32), true);

console.log();
console.log(
  "encode(Buffer.from('0123456789abcdef0123456789abcdef', 'hex'):",
  encode(Buffer.from('0123456789abcdef0123456789abcdef', 'hex'))
);
console.log(
  'decode(1r8amk5hbdkzy0c45utjrnptf7)',
  decode('1r8amk5hbdkzy0c45utjrnptf7').toString('hex')
);

function _expect(input_buffer, b32value) {
  console.error('_expect: testing:', b32value);
  _test(input_buffer, true);
  const b32 = encode(input_buffer);
  if (b32 !== b32value) {
    throw new Error('expect failure: ' + b32 + ' != ' + b32value);
  }
}

function _test(input_buffer, print = 0) {
  const b32 = encode(input_buffer);
  const decoded = decode(b32);
  if (!input_buffer.equals(decoded)) {
    console.error('not equal:', b32, decoded);
    throw new Error('not equal');
  } else {
    print && console.log('equal:', b32);
  }
}

function _binary(buffer) {
  let s = '';
  for (let i = 0; i < buffer.length; i++) {
    s += buffer
      .readUInt8(i)
      .toString(2)
      .padStart(8, '0')
      .split('')
      .reverse()
      .join('');
  }
  let list = [];
  for (let i = 0; i < s.length; i += 5) {
    list.push(
      s
        .slice(i, i + 5)
        .padStart(5, '0')
        .split('')
        .reverse()
        .join('')
    );
  }
  return list.map((seg) => `${seg}(${BASE32[parseInt(seg, 2)]})`).join(' ');
}

function _showTest(name, buffer) {
  console.log(
    name + ': (hex)    (',
    buffer.length,
    '):',
    buffer.toString('hex')
  );
  console.log(name + ':          (', buffer.length, '):', _binary(buffer));
  console.log(
    name + ': encode() (',
    encode(buffer).length,
    '):',
    encode(buffer)
  );
}

console.log();
console.time('rng x 1_000_000');
for (let i = 0; i < 1000000; i++) {
  rng();
}
console.timeEnd('rng x 1_000_000');

console.log();
console.log("rng().toString('base64'):", rng().toString('base64'));
console.time('rng().toString("base64") x 1_000_000');
for (let i = 0; i < MILLION; i++) {
  rng().toString('base64');
}
console.timeEnd('rng().toString("base64") x 1_000_000');

console.log();
console.time('id x 1_000_000');
for (let i = 0; i < MILLION; i++) {
  id();
}
console.timeEnd('id x 1_000_000');

console.log();
console.time('id(8) x 1_000_000');
for (let i = 0; i < MILLION; i++) {
  id(8);
}
console.timeEnd('id(8) x 1_000_000');

console.log();
console.log('encode:', encode(rng()));
console.time('encode x 1_000_000');
for (let i = 0; i < MILLION; i++) {
  encode(rng());
}
console.timeEnd('encode x 1_000_000');

console.log();
console.log('encode(rng(8)):', encode(rng(8)));
console.time('encode(rng(8)) x 1_000_000');
for (let i = 0; i < MILLION; i++) {
  encode(rng(8));
}
console.timeEnd('encode(rng(8)) x 1_000_000');

console.log();
console.time('_test x 1_000_000');
for (let i = 0; i < MILLION; i++) {
  _test(rng());
}
console.timeEnd('_test x 1_000_000');

console.log();
console.time('_test(rng(8)) x 1_000_000');
for (let i = 0; i < MILLION; i++) {
  _test(rng(8));
}
console.timeEnd('_test(rng(8)) x 1_000_000');

console.log();
console.log('crypto.randomUUID():', crypto.randomUUID());
console.time('crypto.randomUUID() 1_000_000');
for (let i = 0; i < MILLION; i++) {
  crypto.randomUUID();
}
console.timeEnd('crypto.randomUUID() 1_000_000');
