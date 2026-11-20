import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import actions from 'actions';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';
import { convertCoreHighlightColor, MARGIN_OPTIONS } from './officeEditor';

describe('officeEditor helpers', () => {
  describe('convertCoreHighlightColor', () => {
    let OriginalColor;

    beforeAll(() => {
      OriginalColor = window.Core.Annotations.Color;
      window.Core.Annotations.Color = class {
        constructor(r, g, b, a) {
          this.r = r;
          this.g = g;
          this.b = b;
          this.a = a;
        }
      };
    });

    afterAll(() => {
      window.Core.Annotations.Color = OriginalColor;
    });

    it('should convert an opaque highlight color into a Color with the same channels', () => {
      const result = convertCoreHighlightColor({ r: 255, g: 255, b: 0, a: 1 });
      expect(result).toBeInstanceOf(window.Core.Annotations.Color);
      expect(result).toEqual(expect.objectContaining({ r: 255, g: 255, b: 0, a: 1 }));
    });

    it('should return null when the highlight color is fully transparent', () => {
      expect(convertCoreHighlightColor({ r: 255, g: 255, b: 0, a: 0 })).toBeNull();
    });

    it('should return null when no highlight color is provided', () => {
      expect(convertCoreHighlightColor(undefined)).toBeNull();
      expect(convertCoreHighlightColor(null)).toBeNull();
    });
  });

  describe('MARGIN_OPTIONS', () => {
    it('should open the margins modal when Custom Margins is chosen', async () => {
      const store = configureStore({ reducer: rootReducer(), preloadedState: rootReducer(undefined, { type: '@@INIT' }) });
      const customMargins = MARGIN_OPTIONS.find((option) => option.key === 'customMargins');

      await customMargins.onClick(store.dispatch, actions);

      expect(selectors.isElementOpen(store.getState(), DataElements.OFFICE_EDITOR_MARGINS_MODAL)).toBe(true);
    });
  });
});
