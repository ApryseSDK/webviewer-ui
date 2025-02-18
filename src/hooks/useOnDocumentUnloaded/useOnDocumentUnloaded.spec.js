import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { useOnDocumentUnloaded } from './useOnDocumentUnloaded';
import core from 'core';

jest.mock('core');

const MockComponent = ({ children }) => (<div>{children}</div>);
const wrapper = withProviders(MockComponent);

describe('useOnDocumentUnloaded hook', () => {
  it('adds event listeners to documentUnloaded', () => {
    core.addEventListener = jest.fn();

    const { result } = renderHook(function() {
      return useOnDocumentUnloaded();
    }, { wrapper });

    expect(result.error).toBeUndefined();

    expect(core.addEventListener).toBeCalledWith('documentUnloaded', expect.any(Function));
  });


  it('removes event listeners to documentUnloaded when component is unmounted', () => {
    core.removeEventListener = jest.fn();

    const { result, unmount } = renderHook(function() {
      return useOnDocumentUnloaded();
    }, { wrapper });

    expect(result.error).toBeUndefined();
    unmount();

    expect(core.removeEventListener).toBeCalledWith('documentUnloaded', expect.any(Function));
  });
});