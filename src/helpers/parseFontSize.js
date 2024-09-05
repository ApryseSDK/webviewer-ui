
// Function parses the "30pt" string to array [30, 'pt']
function parseFontSize(fontSize) {
  if (typeof fontSize === 'number') {
    return [fontSize, 'pt'];
  }
  if (fontSize && !Array.isArray(fontSize)) {
    const result = fontSize?.match(/([0-9.]+)|([a-z]+)/gi);
    return [parseFloat(result[0]), result[1]];
  }
  return [undefined, 'pt'];
}

export default parseFontSize;