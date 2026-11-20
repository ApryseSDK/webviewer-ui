/**
 * @ignore
 * Small routine that strips out the bold and italic from the font name, separates the Font into separate words for the UI
 * @param {string} fontString
 * @returns {string} the separated font name
 */
function getFontDisplayValue(fontString) {
  if (typeof fontString !== 'string') {
    return '';
  }
  const cleanedFontString = fontString.replace(/(Semi|Bold|Italic)+$/gi, '').trim();
  const words = [];
  let currentWord = '';

  for (const char of cleanedFontString) {
    if (char.toUpperCase() === char) {
      if (currentWord) {
        words.push(currentWord.trim());
      }
      currentWord = char;
    } else {
      currentWord += char;
    }
  }

  if (currentWord) {
    words.push(currentWord.trim());
  }

  const separatedFontName = words.join(' ');

  return separatedFontName || fontString;
}

export default getFontDisplayValue;