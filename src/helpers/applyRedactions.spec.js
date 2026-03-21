import applyRedactions from './applyRedactions';
import actions from 'actions';
import core from 'core';
import i18next from 'i18next';
import selectors from 'selectors';

jest.mock('actions', () => ({
  showWarningMessage: jest.fn((warning) => ({
    type: 'SHOW_WARNING_MESSAGE',
    payload: warning,
  })),
}));

jest.mock('core', () => ({
  isWebViewerServerDocument: jest.fn(),
  applyRedactions: jest.fn(),
}));

jest.mock('helpers/downloadPdf', () => jest.fn());
jest.mock('helpers/fireEvent', () => ({ fireError: jest.fn() }));
jest.mock('i18next', () => ({ t: jest.fn((key) => key) }));
jest.mock('selectors', () => ({
  getActiveDocumentViewerKey: jest.fn(),
}));

describe('applyRedactions', () => {
  const dispatch = jest.fn();
  const getState = jest.fn(() => ({ viewer: { activeDocumentViewerKey: 2 } }));

  beforeEach(() => {
    jest.clearAllMocks();
    core.isWebViewerServerDocument.mockReturnValue(false);
    core.applyRedactions.mockResolvedValue();
  });

  it('uses activeDocumentViewerKey from state when not provided', async () => {
    selectors.getActiveDocumentViewerKey.mockReturnValue(2);

    const thunk = applyRedactions(['a']);
    await thunk(dispatch, getState);

    expect(selectors.getActiveDocumentViewerKey).toHaveBeenCalledWith(getState());
    expect(actions.showWarningMessage).toHaveBeenCalled();

    const warning = actions.showWarningMessage.mock.calls[0][0];
    await warning.onConfirm();

    expect(core.applyRedactions).toHaveBeenCalledWith(['a'], 2);
  });

  it('prefers the provided activeDocumentViewerKey', async () => {
    const thunk = applyRedactions(['b'], undefined, 3);
    await thunk(dispatch, getState);

    expect(selectors.getActiveDocumentViewerKey).not.toHaveBeenCalled();
    const warning = actions.showWarningMessage.mock.calls[0][0];
    await warning.onConfirm();

    expect(core.applyRedactions).toHaveBeenCalledWith(['b'], 3);
  });

  it('localizes warning content', () => {
    const thunk = applyRedactions(['c']);
    thunk(dispatch, getState);

    expect(i18next.t).toHaveBeenCalledWith('warning.redaction.applyMessage');
    expect(i18next.t).toHaveBeenCalledWith('warning.redaction.applyTile');
    expect(i18next.t).toHaveBeenCalledWith('action.apply');
  });
});
