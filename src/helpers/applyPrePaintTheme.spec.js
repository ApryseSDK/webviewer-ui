import applyPrePaintTheme from 'helpers/applyPrePaintTheme';
import Theme from 'constants/theme';

describe('applyPrePaintTheme', () => {
  function makeDocumentFragment() {
    const html = document.createElement('html');
    const fakeRoot = {
      documentElement: html,
    };
    return { fakeRoot, html };
  }

  it('sets dataset.theme to dark on the html element', () => {
    const { fakeRoot, html } = makeDocumentFragment();
    applyPrePaintTheme(Theme.DARK, fakeRoot);
    expect(html.dataset.theme).toBe('dark');
  });

  it('sets dataset.theme to light on the html element', () => {
    const { fakeRoot, html } = makeDocumentFragment();
    applyPrePaintTheme(Theme.LIGHT, fakeRoot);
    expect(html.dataset.theme).toBe('light');
  });

  it('falls back to querySelector("html") when documentElement is absent', () => {
    const html = document.createElement('html');
    const fakeRoot = {
      querySelector: (sel) => (sel === 'html' ? html : null),
    };
    applyPrePaintTheme(Theme.DARK, fakeRoot);
    expect(html.dataset.theme).toBe('dark');
  });

  it('does nothing when theme is falsy', () => {
    const { fakeRoot, html } = makeDocumentFragment();
    applyPrePaintTheme('', fakeRoot);
    expect(html.dataset.theme).toBeUndefined();
  });

  it('does nothing when rootNode is null', () => {
    expect(() => applyPrePaintTheme(Theme.DARK, null)).not.toThrow();
  });
});
