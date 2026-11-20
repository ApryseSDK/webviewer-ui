import { parseRecordId } from './officeEditorAnnotationsHelper';

describe('officeEditorAnnotationsHelper', () => {
  describe('parseRecordId', () => {
    it('Should return null for an empty string without warning', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const result = parseRecordId('');
      expect(result).toBeNull();
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('Should convert a numeric string to a number', () => {
      const result = parseRecordId('123');
      expect(result).toBe(123);
    });

    it('Should return null and warn for a non-numeric string', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const result = parseRecordId('abc');
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
