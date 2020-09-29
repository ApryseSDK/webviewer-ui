import '@testing-library/jest-dom/extend-expect';
import '@babel/polyfill';
import withI18n from "./withI18n";
import withMockRedux from "./withMockRedux";

global.withI18n = withI18n;
global.withMockRedux = withMockRedux;

global.withProviders = function withProviders(component) {
  const wrappedI18n = withI18n(component);
  const wrappedMockRedux = withMockRedux(wrappedI18n);
  return wrappedMockRedux;
};
