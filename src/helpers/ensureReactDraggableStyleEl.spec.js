import getRootNode from 'helpers/getRootNode';
import ensureReactDraggableStyleEl from 'helpers/ensureReactDraggableStyleEl';

jest.mock('helpers/getRootNode', () => jest.fn());

describe('ensureReactDraggableStyleEl', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    getRootNode.mockReset();
  });

  it('creates the react-draggable style element in document head with nonce', () => {
    getRootNode.mockReturnValue(document);

    ensureReactDraggableStyleEl('nonce-1');

    const el = document.head.querySelector('#react-draggable-style-el');
    expect(el).not.toBeNull();
    expect(el.nonce).toBe('nonce-1');
  });

  it('updates existing document style element nonce when missing', () => {
    getRootNode.mockReturnValue(document);

    const existing = document.createElement('style');
    existing.id = 'react-draggable-style-el';
    document.head.appendChild(existing);

    ensureReactDraggableStyleEl('nonce-2');

    const el = document.head.querySelector('#react-draggable-style-el');
    expect(el.nonce).toBe('nonce-2');
  });

  it('also ensures style exists in shadow root in web component mode', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
    getRootNode.mockReturnValue(shadowRoot);

    ensureReactDraggableStyleEl('nonce-3');

    const documentStyle = document.head.querySelector('#react-draggable-style-el');
    const shadowStyle = shadowRoot.querySelector('#react-draggable-style-el');

    expect(documentStyle).not.toBeNull();
    expect(shadowStyle).not.toBeNull();
    expect(shadowStyle.nonce).toBe('nonce-3');
  });
});
