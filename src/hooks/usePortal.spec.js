import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import usePortal from './usePortal';
import InstanceRootNodeContext from 'src/context/InstanceRootNodeContext';

describe('usePortal', () => {
  const PORTAL_ID = 'usePortalTestTarget';

  afterEach(() => {
    document.getElementById(PORTAL_ID)?.remove();
    delete window.isApryseWebViewerWebComponent;
  });

  it('appends the portal root to document.body in iframe/legacy mode', () => {
    window.isApryseWebViewerWebComponent = false;

    renderHook(() => usePortal(PORTAL_ID));

    const portalRoot = document.body.querySelector(`#${PORTAL_ID}`);
    expect(portalRoot).toBeInTheDocument();
    expect(portalRoot.parentElement).toBe(document.body);
  });

  it('appends the portal root into the per-instance root from context (not document.body) in WebComponent mode', () => {
    window.isApryseWebViewerWebComponent = true;

    // Fake WC instance root (stands in for a ShadowRoot): has its own
    // lastElementChild so addRootElement's insertBefore call succeeds.
    const instanceRoot = document.createElement('div');
    instanceRoot.appendChild(document.createElement('span'));
    document.body.appendChild(instanceRoot);

    const wrapper = ({ children }) => (
      <InstanceRootNodeContext.Provider value={instanceRoot}>
        {children}
      </InstanceRootNodeContext.Provider>
    );

    renderHook(() => usePortal(PORTAL_ID), { wrapper });

    const portalRoot = instanceRoot.querySelector(`#${PORTAL_ID}`);
    expect(portalRoot).toBeInTheDocument();
    expect(portalRoot.parentElement).toBe(instanceRoot);
    expect(document.body.querySelector(`#${PORTAL_ID}`)).toBe(portalRoot);

    document.body.removeChild(instanceRoot);
  });

  it('calls addRootElement exactly once for a newly created target (regression: no duplicate insertion)', () => {
    window.isApryseWebViewerWebComponent = false;

    const appendSpy = jest.spyOn(document.body, 'insertBefore');

    renderHook(() => usePortal(PORTAL_ID));

    expect(appendSpy).toHaveBeenCalledTimes(1);
    appendSpy.mockRestore();
  });

  it('reuses an existing DOM element with the given id instead of creating a new one', () => {
    window.isApryseWebViewerWebComponent = false;
    const existing = document.createElement('div');
    existing.id = PORTAL_ID;
    document.body.appendChild(existing);

    renderHook(() => usePortal(PORTAL_ID));

    const matches = document.body.querySelectorAll(`#${PORTAL_ID}`);
    expect(matches.length).toBe(1);
    expect(matches[0]).toBe(existing);
  });

  it('reuses an existing DOM element with the given id inside the instance root in WebComponent mode', () => {
    window.isApryseWebViewerWebComponent = true;
    const instanceRoot = document.createElement('div');
    const existing = document.createElement('div');
    existing.id = PORTAL_ID;
    instanceRoot.appendChild(existing);
    document.body.appendChild(instanceRoot);

    const wrapper = ({ children }) => (
      <InstanceRootNodeContext.Provider value={instanceRoot}>
        {children}
      </InstanceRootNodeContext.Provider>
    );

    renderHook(() => usePortal(PORTAL_ID), { wrapper });

    const matches = instanceRoot.querySelectorAll(`#${PORTAL_ID}`);
    expect(matches.length).toBe(1);
    expect(matches[0]).toBe(existing);

    document.body.removeChild(instanceRoot);
  });
});
