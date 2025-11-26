import React from 'react';
import { render } from '@testing-library/react';
import { Basic } from './Outline.stories';
import { shouldExpandOutline } from './Outline';

const BasicOutline = withProviders(Basic);

describe('Outline', () => {
  it('Story should not throw any errors', () => {
    expect(() => {
      render(<BasicOutline />);
    }).not.toThrow();
  });

  describe('shouldExpandOutline', () => {
    it('returns true for descendant outline paths', () => {
      expect(shouldExpandOutline('2-5-3', '2')).toBe(true);
    });

    it('returns false when active outline matches exactly with the outline path', () => {
      expect(shouldExpandOutline('2', '2')).toBe(false);
    });

    it('returns false when active outline shares only prefix characters of the outline path', () => {
      expect(shouldExpandOutline('22', '2')).toBe(false);
    });

    it('returns false when active outline is NOT a parent outline', () => {
      expect(shouldExpandOutline('222-223-225', '0')).toBe(false);
    });

    it('returns false when outline path is null', () => {
      expect(shouldExpandOutline('2-1', null)).toBe(false);
    });
  });
});
