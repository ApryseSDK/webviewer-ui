import '@testing-library/jest-dom/extend-expect';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import './miscMock';
import withI18n from './withI18n';
import withMockRedux from './withMockRedux';
import 'jest-canvas-mock';

import React, { Component as mockComponent } from 'react';

global.withI18n = withI18n;
global.withMockRedux = withMockRedux;

global.withProviders = function withProviders(component) {
  const wrappedI18n = withI18n(component);
  const wrappedMockRedux = withMockRedux(wrappedI18n);
  return wrappedMockRedux;
};

const portalElement = document.createElement('div');
portalElement.setAttribute('id', 'app');
document.body.appendChild(portalElement);

// This is a mock of the Virtuoso component that is used in the RedactionPanel component
// Virtuoso does not add the items to the DOM, even if the renders are called
// This is a workaround to actually render the items in the tests
jest.mock('react-virtuoso', () => {
  const mockVirtuoso = () =>
    class extends mockComponent {
      displayName = 'Mocked Virtuoso';
      render() {
        return <>{this.props.data?.map((value, index) => this.props.itemContent?.(index, value, undefined))}</>;
      }
    };
  return { Virtuoso: mockVirtuoso() };
});
