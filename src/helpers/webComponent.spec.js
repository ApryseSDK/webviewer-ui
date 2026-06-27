import { getDOMActiveElement } from './webComponent';

describe('webComponent helper', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns document active element when no shadow root is present', () => {
    const input = document.createElement('input');
    jest.spyOn(document, 'activeElement', 'get').mockReturnValue(input);

    expect(getDOMActiveElement()).toBe(input);
  });

  it('returns shadow root active element when host is active', () => {
    const innerInput = document.createElement('input');
    const host = {
      shadowRoot: {
        activeElement: innerInput,
      },
    };
    jest.spyOn(document, 'activeElement', 'get').mockReturnValue(host);

    expect(getDOMActiveElement()).toBe(innerInput);
  });

  it('returns deepest active element for nested shadow roots', () => {
    const deepestInput = document.createElement('input');
    const nestedHost = {
      shadowRoot: {
        activeElement: deepestInput,
      },
    };
    const host = {
      shadowRoot: {
        activeElement: nestedHost,
      },
    };
    jest.spyOn(document, 'activeElement', 'get').mockReturnValue(host);

    expect(getDOMActiveElement()).toBe(deepestInput);
  });

  it('returns null when there is no active element', () => {
    jest.spyOn(document, 'activeElement', 'get').mockReturnValue(null);

    expect(getDOMActiveElement()).toBeNull();
  });
});