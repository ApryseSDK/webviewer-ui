import core from 'core';
import selectors from 'selectors';
import Events from 'constants/events';
import { getEventHandler } from 'helpers/fireEvent';
import startTextComparison from './startTextComparison';

jest.mock('core', () => ({
  getDocumentViewers: jest.fn(),
}));

jest.mock('selectors', () => ({
  isMultiViewerMode: jest.fn(),
}));

const createViewer = () => ({ startSemanticDiff: jest.fn() });

describe('startTextComparison', () => {
  const store = { getState: jest.fn(), dispatch: jest.fn() };
  let primary;
  let secondary;

  beforeEach(() => {
    jest.clearAllMocks();
    selectors.isMultiViewerMode.mockReturnValue(true);
    primary = createViewer();
    secondary = createViewer();
  });

  afterEach(() => {
    getEventHandler()._events = {};
  });

  it('should start the comparison right away when both viewers exist', () => {
    core.getDocumentViewers.mockReturnValue([primary, secondary]);

    startTextComparison(store)();

    expect(primary.startSemanticDiff).toHaveBeenCalledTimes(1);
    expect(primary.startSemanticDiff).toHaveBeenCalledWith(secondary);
  });

  it('should start the comparison once the second viewer is ready', () => {
    core.getDocumentViewers.mockReturnValue([primary]);
    startTextComparison(store)();
    primary.startSemanticDiff.mockClear();

    core.getDocumentViewers.mockReturnValue([primary, secondary]);
    getEventHandler().trigger(Events.MULTI_VIEWER_READY);

    expect(primary.startSemanticDiff).toHaveBeenCalledTimes(1);
    expect(primary.startSemanticDiff).toHaveBeenCalledWith(secondary);
  });

  it('should not start the comparison again on a later MultiViewer ready event', () => {
    core.getDocumentViewers.mockReturnValue([primary]);
    startTextComparison(store)();
    primary.startSemanticDiff.mockClear();

    core.getDocumentViewers.mockReturnValue([primary, secondary]);
    getEventHandler().trigger(Events.MULTI_VIEWER_READY);
    getEventHandler().trigger(Events.MULTI_VIEWER_READY);

    expect(primary.startSemanticDiff).toHaveBeenCalledTimes(1);
  });

  it('should run each pending call exactly once when the API is called repeatedly before the viewer is ready', () => {
    core.getDocumentViewers.mockReturnValue([primary]);
    startTextComparison(store)();
    startTextComparison(store)();
    primary.startSemanticDiff.mockClear();

    core.getDocumentViewers.mockReturnValue([primary, secondary]);
    getEventHandler().trigger(Events.MULTI_VIEWER_READY);
    getEventHandler().trigger(Events.MULTI_VIEWER_READY);

    expect(primary.startSemanticDiff).toHaveBeenCalledTimes(2);
  });

  it('should do nothing outside MultiViewer mode', () => {
    selectors.isMultiViewerMode.mockReturnValue(false);
    jest.spyOn(console, 'error').mockImplementation(() => {});
    core.getDocumentViewers.mockReturnValue([primary, secondary]);

    startTextComparison(store)();

    expect(primary.startSemanticDiff).not.toHaveBeenCalled();
    console.error.mockRestore();
  });
});
