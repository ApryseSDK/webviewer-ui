/**
 * CUSTOM WISEFLOW
 */

/** Get hash of the annotation information */
function getAnnotationHash(annotation) {
  const annotationString = `${annotation.Author} ${annotation.DateCreated} ${annotation.Id}`;
  return numbersToLetters(hashString16(annotationString));
}

/** Get annotation reference */
function getAnnotationReference(annotation) {
  return `P${annotation.getPageNumber()}-${getAnnotationHash(annotation)}`;
}

/** Hash string into 16-bit number */
function hashString16(s) {
  return Math.abs(Array.from(s).reduce((s, c) => (((Math.imul(31, s) + c.charCodeAt(0)) | 0) * 0x80008001) >> 16, 0));
}

/** Convert number into uppercase string of letters */
function numbersToLetters(n) {
  return n
    .toString()
    .split('')
    .map(c => String.fromCharCode(parseInt(c) + 97))
    .join('')
    .toUpperCase();
}

export default getAnnotationReference;
export { getAnnotationHash, hashString16, numbersToLetters };
