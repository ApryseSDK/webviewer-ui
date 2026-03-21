import { buildSearchOptions, parseRegexLiteral, escapeRegExp } from 'helpers/redactionSearchOptions';
import { redactionTypeMap } from 'constants/redactionTypes';

describe('RedactionSearchOverlay helpers', () => {
  describe('parseRegexLiteral', () => {
    it('parses a regex literal with no flags', () => {
      const regex = parseRegexLiteral('/foo/');
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.source).toBe('foo');
      expect(regex.ignoreCase).toBe(false);
    });

    it('parses a regex literal with i flag', () => {
      const regex = parseRegexLiteral('/foo/i');
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.source).toBe('foo');
      expect(regex.ignoreCase).toBe(true);
    });

    it('accepts g flag but ignores it', () => {
      const regex = parseRegexLiteral('/foo/g');
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.source).toBe('foo');
      expect(regex.ignoreCase).toBe(false);
    });

    it('accepts gi flags but ignores g', () => {
      const regex = parseRegexLiteral('/foo/gi');
      expect(regex).toBeInstanceOf(RegExp);
      expect(regex.source).toBe('foo');
      expect(regex.ignoreCase).toBe(true);
    });

    it('rejects unsupported flags', () => {
      const regex = parseRegexLiteral('/foo/m');
      expect(regex).toBeNull();
    });

    it('rejects invalid regex patterns', () => {
      const regex = parseRegexLiteral('/(/');
      expect(regex).toBeNull();
    });
  });

  describe('buildSearchOptions', () => {
    it('returns defaults for null input', () => {
      expect(buildSearchOptions(null)).toEqual({
        textSearch: [],
        caseSensitive: true,
      });
    });

    it('treats plain text as literal and forces case insensitive', () => {
      const options = buildSearchOptions([
        { type: redactionTypeMap['TEXT'], label: 'a.b', value: 'a.b' },
      ]);
      expect(options.textSearch).toEqual(['a\\.b']);
      expect(options.caseSensitive).toBe(false);
    });

    it('treats regex literal as regex and respects case sensitivity', () => {
      const regex = parseRegexLiteral('/foo/');
      const options = buildSearchOptions([
        {
          type: redactionTypeMap['TEXT'],
          label: '/foo/',
          isRegex: true,
          regex,
        },
      ]);
      expect(options.textSearch).toEqual(['foo']);
      expect(options.caseSensitive).toBe(true);
    });

    it('sets caseSensitive false when regex has ignoreCase', () => {
      const regex = parseRegexLiteral('/foo/i');
      const options = buildSearchOptions([
        {
          type: redactionTypeMap['TEXT'],
          label: '/foo/i',
          isRegex: true,
          regex,
        },
      ]);
      expect(options.caseSensitive).toBe(false);
    });

    it('treats invalid regex literal as plain text', () => {
      const regex = parseRegexLiteral('/(/');
      expect(regex).toBeNull();
      const options = buildSearchOptions([
        {
          type: redactionTypeMap['TEXT'],
          label: '/(/',
          isRegex: false,
          regex: undefined,
        },
      ]);
      expect(options.textSearch).toEqual([escapeRegExp('/(/')]);
      expect(options.caseSensitive).toBe(false);
    });

    it('handles null entries without throwing', () => {
      const options = buildSearchOptions([
        null,
        { type: redactionTypeMap['TEXT'], label: 'test' },
      ]);
      expect(options.textSearch).toEqual(['test']);
      expect(options.caseSensitive).toBe(false);
    });
  });
});
