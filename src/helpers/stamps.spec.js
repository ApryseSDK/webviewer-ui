import {
  getCustomStampCategoryFromAnnotation,
  getDefaultCustomStampCategory,
  getDefaultStandardStampCategory,
  getStandardStampCategoryFromAnnotation,
} from './stamps';

describe('stamps helper', () => {
  describe('getDefaultCustomStampCategory', () => {
    it('returns the default custom stamp category', () => {
      expect(getDefaultCustomStampCategory()).toBe('option.customStampModal.customStamp');
    });
  });

  describe('getDefaultStandardStampCategory', () => {
    it('returns the default standard stamp category', () => {
      expect(getDefaultStandardStampCategory()).toBe('rubberStampPanel.standard');
    });
  });

  describe('getCustomStampCategoryFromAnnotation', () => {
    it('reads the category from serialized custom stamp data', () => {
      const annotation = {
        getCustomData: jest.fn(() => JSON.stringify({ category: 'Legal' })),
      };
      expect(getCustomStampCategoryFromAnnotation(annotation)).toBe('Legal');
      expect(annotation.getCustomData).toHaveBeenCalledWith('trn-custom-stamp');
    });

    it('prefers serialized custom stamp category over annotation category', () => {
      const annotation = {
        category: 'Legacy',
        getCustomData: jest.fn(() => JSON.stringify({ category: 'Serialized' })),
      };
      expect(getCustomStampCategoryFromAnnotation(annotation)).toBe('Serialized');
    });

    it('falls back to annotation category when serialized custom stamp data is malformed', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const annotation = {
        category: 'Legacy',
        getCustomData: jest.fn(() => '{malformed-json'),
      };
      expect(getCustomStampCategoryFromAnnotation(annotation)).toBe('Legacy');
      expect(warnSpy).toHaveBeenCalledWith('Failed to parse custom stamp data', expect.any(SyntaxError));
      warnSpy.mockRestore();
    });

    it('falls back to the default custom stamp category when no category exists', () => {
      const annotation = {
        getCustomData: jest.fn(() => JSON.stringify({ title: 'Untitled' })),
      };
      expect(getCustomStampCategoryFromAnnotation(annotation)).toBe(getDefaultCustomStampCategory());
    });
  });

  describe('getStandardStampCategoryFromAnnotation', () => {
    it('returns the category from the annotation', () => {
      const annotation = {
        category: 'StandardCategory',
      };
      expect(getStandardStampCategoryFromAnnotation(annotation)).toBe('StandardCategory');
    });

    it('falls back to the default standard stamp category when no category exists', () => {
      const annotation = {};
      expect(getStandardStampCategoryFromAnnotation(annotation)).toBe(getDefaultStandardStampCategory());
    });
  });
});