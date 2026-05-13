import '@testing-library/jest-dom/extend-expect';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './miscMock';
import withI18n from './withI18n';
import withMockRedux from './withMockRedux';
import 'jest-canvas-mock';


if (typeof CSSStyleSheet === 'undefined') {
  global.CSSStyleSheet = function CSSStyleSheet() {
    this.cssRules = [];
  };
}

if (!CSSStyleSheet.prototype.replaceSync) {
  CSSStyleSheet.prototype.replaceSync = function() {};
}

if (!CSSStyleSheet.prototype.replace) {
  CSSStyleSheet.prototype.replace = function() {
    return Promise.resolve(this);
  };
}

function defineAdoptedStyleSheets(proto, backingField) {
  if (proto && !('adoptedStyleSheets' in proto)) {
    Object.defineProperty(proto, 'adoptedStyleSheets', {
      get() {
        return this[backingField] || [];
      },
      set(sheets) {
        this[backingField] = sheets;
      },
    });
  }
}

defineAdoptedStyleSheets(Document.prototype, '_adoptedStyleSheets');

defineAdoptedStyleSheets(
  typeof ShadowRoot === 'undefined' ? undefined : ShadowRoot.prototype,
  '_shadowAdoptedStyleSheets',
);

global.withI18n = withI18n;
global.withMockRedux = withMockRedux;

global.withProviders = function withProviders(component, mockInitialState = {}) {
  const wrappedI18n = withI18n(component);
  const wrappedMockRedux = withMockRedux(wrappedI18n, mockInitialState);
  return wrappedMockRedux;
};

const portalElement = document.createElement('div');
portalElement.setAttribute('id', 'app');
document.body.appendChild(portalElement);

//A mock for tests that pull in stories
if (typeof window === 'undefined') {
  global.window = {};
  console.warn('window is undefined, creating a mock window object for tests');
}

// Provide a Storybook-like global for stories imported in Jest
window.storybook = window.storybook || {};

// Ensure a #storybook-root exists so any Storybook-specific layout code can resolve a rect
if (!document.getElementById('storybook-root')) {
  const sbRoot = document.createElement('div');
  sbRoot.setAttribute('id', 'storybook-root');
  // Give it some dimensions so any layout math using getBoundingClientRect() has numbers
  sbRoot.style.width = '1024px';
  sbRoot.style.height = '768px';
  document.body.appendChild(sbRoot);
}