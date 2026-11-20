import React from 'react';
import i18next from 'i18next';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen, act } from '@testing-library/react';
import useCore from 'hooks/useCore';
import DataElements from 'constants/dataElement';
import OfficeSuggestionsContainer from './OfficeSuggestionsContainer';

jest.mock('hooks/useCore');

jest.mock('actions', () => ({
  __esModule: true,
  default: {
    closeElement: jest.fn((element) => ({ type: 'CLOSE_ELEMENT', payload: element })),
  },
}));

const createSpellCheckManagerMock = (overrides = {}) => ({
  isSpellCheckEnabled: jest.fn(() => true),
  ...overrides,
});

const createState = ({ disabledElements = {} } = {}) => ({
  viewer: {
    disabledElements,
  },
});

const createSpellingError = (id) => ({ spellingErrorId: id, misspelledWord: `misspelling${id}` });

const renderWithState = async (state, props = {}) => {
  const store = configureStore({ reducer: () => state });
  const { container } = render(
    <Provider store={store}>
      <OfficeSuggestionsContainer {...props} />
    </Provider>,
  );
  await act(async () => {});
  return { container };
};

const getSuggestionsSection = (container) => container.querySelector(
  `[data-element="${DataElements.OFFICE_EDITOR_SPELL_CHECK_SUGGESTIONS}"]`,
);

describe('OfficeSuggestionsContainer', () => {
  const setSpellCheckManager = (overrides = {}) => {
    const spellCheckManager = createSpellCheckManagerMock(overrides);
    const officeEditor = { getSpellCheckManager: jest.fn(() => spellCheckManager) };
    useCore.mockReturnValue({ core: { getOfficeEditor: () => officeEditor } });
  };

  beforeEach(() => {
    setSpellCheckManager();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the suggestions section for the misspelled word under the cursor', async () => {
    const { container } = await renderWithState(createState(), createSpellingError(1));

    expect(await screen.findByText(i18next.t('officeEditor.spellCheck.noSuggestions'))).toBeInTheDocument();
    expect(getSuggestionsSection(container)).not.toBeNull();
  });

  it('should not render suggestions when spell check is disabled', async () => {
    setSpellCheckManager({ isSpellCheckEnabled: jest.fn(() => false) });

    const { container } = await renderWithState(createState(), createSpellingError(1));

    expect(getSuggestionsSection(container)).toBeNull();
  });

  it('should not render suggestions when the right-click was not on a misspelling', async () => {
    const { container } = await renderWithState(createState(), { spellingErrorId: null, misspelledWord: null });

    expect(getSuggestionsSection(container)).toBeNull();
  });

  it('should hide suggestions when officeEditorSpellCheckSuggestions is disabled via the API', async () => {
    const state = createState({
      disabledElements: { [DataElements.OFFICE_EDITOR_SPELL_CHECK_SUGGESTIONS]: { disabled: true } },
    });

    const { container } = await renderWithState(state, createSpellingError(1));

    expect(getSuggestionsSection(container)).toBeNull();
  });
});
