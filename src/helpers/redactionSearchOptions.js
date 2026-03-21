import { redactionTypeMap } from 'constants/redactionTypes';

export const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const parseRegexLiteral = (value) => {
  const match = value.match(/^\/(.+)\/([gi]*)$/);
  if (!match) {
    return null;
  }
  const [, pattern, flags] = match;
  const normalizedFlags = flags.replace('g', '');
  try {
    return new RegExp(pattern, normalizedFlags);
  } catch (e) {
    return null;
  }
};

export const buildSearchOptions = (searchTerms) => {
  const options = {
    textSearch: [],
    caseSensitive: true,
  };

  if (!searchTerms) {
    return options;
  }

  searchTerms.forEach((searchTerm) => {
    if (!searchTerm) {
      return;
    }
    const { type } = searchTerm;
    if (type === redactionTypeMap['TEXT']) {
      if (searchTerm.isRegex && searchTerm.regex) {
        options.textSearch.push(searchTerm.regex.source);
      } else {
        options.textSearch.push(escapeRegExp(searchTerm.label || ''));
        options.caseSensitive = false;
      }
    } else {
      options[type] = true;
    }
    if (searchTerm.regex) {
      options.caseSensitive = options.caseSensitive && !searchTerm.regex.ignoreCase;
    }
  });

  return options;
};
