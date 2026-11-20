import { addSearchListener, removeSearchListener, clearSearchListeners, getSearchListeners, overrideSearchExecution, getOverrideSearchExecution } from 'helpers/search';
import { getFontPath, setFontPath } from 'src/apis/fontPathHandler';
import { setClickMiddleWare, getClickMiddleWare } from 'helpers/clickTracker';
import { setGrayscaleDarknessFactor, getGrayscaleDarknessFactor } from 'helpers/grayScaleHelper';
import { setMinZoomLevel, getMinZoomLevel, setMaxZoomLevel, getMaxZoomLevel } from 'constants/zoomFactors';
import mentionsManager from 'helpers/MentionsManager';
import { registerInstance, unregisterInstance, resetInstances, runWithInstance } from 'core/documentViewers';

jest.mock('helpers/officeEditor', () => ({ isOfficeEditorMode: () => false }));

const inInstance = (instanceId, fn) => runWithInstance(instanceId, fn);

describe('helpers configured through instance APIs', () => {
  beforeEach(() => {
    registerInstance(1);
    registerInstance(2);
  });

  afterEach(() => {
    resetInstances();
  });

  it('should keep search listeners and search overrides separate per instance', () => {
    const listener = jest.fn();
    const override = jest.fn();
    inInstance(1, () => {
      addSearchListener(listener);
      overrideSearchExecution(override);
    });

    expect(inInstance(1, getSearchListeners)).toEqual([listener]);
    expect(inInstance(1, getOverrideSearchExecution)).toBe(override);
    expect(inInstance(2, getSearchListeners)).toEqual([]);
    expect(inInstance(2, getOverrideSearchExecution)).toBeUndefined();
  });

  it('should remove and clear search listeners only in the instance that changed them', () => {
    const removed = jest.fn();
    const kept = jest.fn();
    inInstance(1, () => {
      addSearchListener(removed);
      addSearchListener(kept);
    });
    inInstance(2, () => addSearchListener(removed));

    inInstance(1, () => removeSearchListener(removed));
    expect(inInstance(1, getSearchListeners)).toEqual([kept]);
    expect(inInstance(2, getSearchListeners)).toEqual([removed]);

    inInstance(1, clearSearchListeners);
    expect(inInstance(1, getSearchListeners)).toEqual([]);
    expect(inInstance(2, getSearchListeners)).toEqual([removed]);
  });

  it('should keep the maximum zoom level and the font path separate per instance', () => {
    inInstance(1, () => {
      setMaxZoomLevel(4);
      setFontPath('/fonts-of-instance-1');
    });

    expect(inInstance(1, getMaxZoomLevel)).toBe(4);
    expect(inInstance(2, getMaxZoomLevel)).toBe(99.99);
    expect(inInstance(1, getFontPath)).toBe('/fonts-of-instance-1/');
    expect(inInstance(2, getFontPath)).toBeNull();
  });

  it('should keep click middleware, grayscale factor and zoom limits separate per instance', () => {
    const middleware = jest.fn();
    inInstance(1, () => {
      setClickMiddleWare(middleware);
      setGrayscaleDarknessFactor(0.5);
      setMinZoomLevel(0.5);
    });

    expect(inInstance(1, getClickMiddleWare)).toBe(middleware);
    expect(inInstance(2, getClickMiddleWare)).toBeUndefined();
    expect(inInstance(2, getGrayscaleDarknessFactor)).toBe(1);
    expect(inInstance(2, getMinZoomLevel)).toBe(0.05);
  });

  it('should keep mention lookup callbacks separate per instance', () => {
    const lookupA = jest.fn();
    const lookupB = jest.fn();
    inInstance(1, () => mentionsManager.setMentionLookupCallback(lookupA));
    inInstance(2, () => mentionsManager.setMentionLookupCallback(lookupB));

    expect(inInstance(1, () => mentionsManager.getMentionLookupCallback())).toBe(lookupA);
    expect(inInstance(2, () => mentionsManager.getMentionLookupCallback())).toBe(lookupB);
  });

  it('should drop only the disposed instance\'s helper state', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    inInstance(1, () => addSearchListener(listenerA));
    inInstance(2, () => addSearchListener(listenerB));

    unregisterInstance(1);

    expect(inInstance(1, getSearchListeners)).toEqual([]);
    expect(inInstance(2, getSearchListeners)).toEqual([listenerB]);
  });
});
