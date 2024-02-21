import PropTypes from 'prop-types';

const wildCardMatch = (allowedOrigins, origin) => allowedOrigins.filter((allowedOrigin) => wildcardToRegExp(allowedOrigin).test(origin)).length;

// Creates a RegExp from the given string, converting asterisks to .* expressions,
// and escaping all other characters.
const wildcardToRegExp = (s) => {
  return new RegExp(`^${s.split(/\*+/).map(regExpEscape).join('.*')}$`);
};

// RegExp-escapes all characters in the given string
const regExpEscape = (s) => {
  return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
};

wildCardMatch.PropTypes = {
  allowedOrigins: PropTypes.array,
  origin: PropTypes.string
};

export default wildCardMatch;