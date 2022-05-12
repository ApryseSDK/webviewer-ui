/**
 * CUSTOM WISEFLOW
 * Hash string into 16-bit number
 * @param s {string} - string to hash
 */
function hashString16(s) {
  const hash = Math.abs(Array.from(s).reduce((s, c) => (((Math.imul(31, s) + c.charCodeAt(0)) | 0) * 0x80008001) >> 16, 0))
  return hash.toString().split('').map(c => String.fromCharCode(parseInt(c) + 97)).join('').toUpperCase();
}

export default hashString16;
