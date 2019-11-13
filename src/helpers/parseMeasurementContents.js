const commaRegex = /,/g;

export default content => {
  content = content?.replace(commaRegex, '');

  return content ? parseFloat(content) : undefined;
};