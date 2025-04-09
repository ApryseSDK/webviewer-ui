
/**
 * @ignore
 * Converts text with newlines ("\n") into <p>...</p> elements to ensure proper
 * multiline handling in the editor. If no newlines are present, the original
 * text is returned.
 *
 * @param {string} value - The text to convert.
 * @returns {string} The converted text with <p> tags around each line.
 */
function convertNewlinesToParagraphs(value) {
  if (!value) {
    return value;
  }
  const valueSplit = value.split('\n');
  const containsNewlines = valueSplit.length > 1;
  if (!containsNewlines) {
    return value;
  }

  const contentArray = valueSplit;
  return contentArray.map((text) => `<p>${text || '<br>'}</p>`).join('');
}

export default convertNewlinesToParagraphs;