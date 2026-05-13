import DataElements from 'constants/dataElement';
import { VIEWER_CONFIGURATIONS } from 'constants/customizationVariables';
import viewerReducer from 'reducers/viewerReducer';
import { defaultPanels, defaultPopups } from 'src/redux/modularComponents';
import { defaultOfficeEditorPopups } from 'src/redux/officeEditorModularComponents';

describe('viewerReducer modularPopups mode stash/restore', () => {
  let state;
  let reducer;
  const contextMenu = DataElements.CONTEXT_MENU_POPUP;

  const reduce = (action) => {
    state = reducer(state, action);
  };
  const restore = (UIMode) => reduce({ type: 'RESTORE_COMPONENTS', payload: { UIMode } });
  const stash = (UIMode) => reduce({ type: 'STASH_COMPONENTS', payload: { UIMode } });
  const setPopup = (dataElement, items) => reduce({
    type: 'SET_POPUP_ITEMS',
    payload: { dataElement, items },
  });
  const contextItems = () => state.modularPopups[contextMenu];

  beforeEach(() => {
    reducer = viewerReducer({
      modularHeaders: {},
      modularComponents: {},
      modularPopups: { ...defaultPopups },
      genericPanels: [...defaultPanels],
      flyoutMap: {},
      modularComponentStash: {},
    });
    state = reducer(undefined, { type: '@@INIT' });
  });

  test('keeps OE custom context-menu items in OE and out of PDF mode after mode switches', () => {
    const oeMode = VIEWER_CONFIGURATIONS.DOCX_EDITOR;
    const pdfMode = VIEWER_CONFIGURATIONS.DEFAULT;
    const oeDefaults = defaultOfficeEditorPopups[contextMenu];
    const pdfDefaults = defaultPopups[contextMenu];
    const oeCustomItem = { dataElement: 'oeCustomContextMenuItem', type: 'actionButton' };

    restore(oeMode);
    setPopup(contextMenu, [...contextItems(), oeCustomItem]);
    stash(oeMode);
    restore(pdfMode);

    expect(contextItems()).toEqual(pdfDefaults);
    expect(contextItems()).not.toContainEqual(oeCustomItem);

    restore(oeMode);
    expect(contextItems()).toEqual([...oeDefaults, oeCustomItem]);
  });

  test('restores stashed modularPopups with OE defaults and user overrides', () => {
    const oeMode = VIEWER_CONFIGURATIONS.DOCX_EDITOR;
    const pdfMode = VIEWER_CONFIGURATIONS.DEFAULT;
    const oeDefaults = defaultOfficeEditorPopups[contextMenu];
    const oeCustomContextItem = { dataElement: 'oeContextCustomItem', type: 'actionButton' };
    const annotationOverride = [{ dataElement: 'oeAnnotationCustomItem', type: 'actionButton' }];

    restore(oeMode);
    setPopup(contextMenu, [...oeDefaults, oeCustomContextItem]);
    setPopup(DataElements.ANNOTATION_POPUP, annotationOverride);
    stash(oeMode);
    restore(pdfMode);
    setPopup(contextMenu, [{ dataElement: 'pdfOnlyContextItem', type: 'actionButton' }]);
    restore(oeMode);

    expect(contextItems()).toEqual([...oeDefaults, oeCustomContextItem]);
    expect(contextItems()).not.toContainEqual({ dataElement: 'pdfOnlyContextItem', type: 'actionButton' });
    expect(state.modularPopups[DataElements.ANNOTATION_POPUP]).toEqual(annotationOverride);
  });
});
