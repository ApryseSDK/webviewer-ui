export const createLoadErrorMessage = ({
  message,
  filename = '',
  functionName = '',
  lineNumber = '',
}) => {
  const lines = [
    'Exception:',
    `\t Message: ${message}`,
  ];

  if (filename !== '') {
    lines.push(`\t Filename: ${filename}`);
  }

  if (functionName !== '') {
    lines.push(`\t Function: ${functionName}`);
  }

  if (lineNumber !== '') {
    lines.push(`\t Linenumber: ${lineNumber}`);
  }

  return lines.join('\n');
};

export const createStructuredLoadError = ({
  message,
  type,
  filename,
  functionName,
  lineNumber,
}) => ({
  message: createLoadErrorMessage({
    message,
    filename,
    functionName,
    lineNumber,
  }),
  type,
});