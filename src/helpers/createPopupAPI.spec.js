import createPopupAPI from './createPopupAPI';
import * as actions from 'actions';
import { defaultPopups } from '../redux/modularComponents';

// Mock selectors/actions - we do integration tests separately
jest.mock('selectors', () => ({
  getPopupItems: jest.fn(),
}));
jest.mock('actions', () => ({
  setPopupItems: jest.fn((popupDataElement, items) => ({
    type: 'SET_POPUP_ITEMS',
    payload: { popupDataElement, items },
  })),
}));

// Grab the mocked selectors after jest.mock
import { getPopupItems } from 'selectors';
import DataElements from 'src/constants/dataElement';

const makeStore = () => ({
  getState: jest.fn(() => ({})),
  dispatch: jest.fn(),
});

describe('createPopupAPI', () => {
  const popup = DataElements.CONTEXT_MENU_POPUP;
  let store;

  beforeEach(() => {
    store = makeStore();
    jest.clearAllMocks();
  });

  const seedItems = (items) => {
    getPopupItems.mockImplementation((_, popupDataElement) => {
      return popupDataElement === popup ? items : [];
    });
  };

  test('getItems returns a copy of selector output', () => {
    const original = defaultPopups[DataElements.ANNOTATION_POPUP];
    seedItems(original);

    const api = createPopupAPI(store, popup);
    const items = api.getItems();

    expect(items).toEqual(original);
    expect(items).not.toBe(original); // should be a shallow copy
  });

  test('update replaces all items (happy path)', () => {
    const api = createPopupAPI(store, popup);
    const next = [{ dataElement: DataElements.VIEW_FILE_BUTTON }, { dataElement: DataElements.STYLE_EDIT_BUTTON }];

    api.update(next);

    expect(actions.setPopupItems).toHaveBeenCalledWith(popup, next);
    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SET_POPUP_ITEMS',
      payload: { popupDataElement: popup, items: next },
    });
  });

  test('update with no args clears items', () => {
    const api = createPopupAPI(store, popup);

    api.update();

    expect(actions.setPopupItems).toHaveBeenCalledWith(popup, []);
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('add inserts after the given dataElement', () => {
    seedItems(defaultPopups[DataElements.ANNOTATION_POPUP]);
    const api = createPopupAPI(store, popup);

    const newBtn = { dataElement: 'inserted', type: 'actionButton' };
    api.add(newBtn, DataElements.STYLE_EDIT_BUTTON);

    expect(actions.setPopupItems).toHaveBeenCalledWith(popup, [
      { dataElement: DataElements.VIEW_FILE_BUTTON },
      { dataElement: DataElements.COMMENT_BUTTON },
      { dataElement: DataElements.STYLE_EDIT_BUTTON },
      newBtn,
      { dataElement: DataElements.DATE_EDIT_BUTTON },
      { dataElement: DataElements.REDACT_BUTTON },
      { dataElement: DataElements.CROP_BUTTON },
      { dataElement: DataElements.CONTENT_EDIT_BUTTON },
      { dataElement: DataElements.CLEAR_SIGNATURE_BUTTON },
      { dataElement: DataElements.GROUP_BUTTON },
      { dataElement: DataElements.UNGROUP_BUTTON },
      { dataElement: DataElements.FORM_FIELD_EDIT_BUTTON },
      { dataElement: DataElements.CALIBRATION_POPUP_BUTTON },
      { dataElement: DataElements.LINK_BUTTON },
      { dataElement: DataElements.FILE_ATTACHMENT_DOWNLOAD },
      { dataElement: DataElements.ANNOTATION_DELETE_BUTTON },
      { dataElement: DataElements.SHORTCUT_KEYS_FOR_3D },
      { dataElement: DataElements.PLAY_SOUND_BUTTON },
      { dataElement: DataElements.OPEN_ALIGNMENT_BUTTON },
    ]);
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('add at the beginning when dataElement is undefined', () => {
    seedItems(defaultPopups[DataElements.ANNOTATION_POPUP]);
    const api = createPopupAPI(store, popup);

    const newBtns = [
      { dataElement: 'x' },
      { dataElement: 'y' },
    ];
    api.add(newBtns); // no second arg

    expect(actions.setPopupItems).toHaveBeenCalledWith(popup, [
      { dataElement: 'x' },
      { dataElement: 'y' },
      { dataElement: DataElements.VIEW_FILE_BUTTON },
      { dataElement: DataElements.COMMENT_BUTTON },
      { dataElement: DataElements.STYLE_EDIT_BUTTON },
      { dataElement: DataElements.DATE_EDIT_BUTTON },
      { dataElement: DataElements.REDACT_BUTTON },
      { dataElement: DataElements.CROP_BUTTON },
      { dataElement: DataElements.CONTENT_EDIT_BUTTON },
      { dataElement: DataElements.CLEAR_SIGNATURE_BUTTON },
      { dataElement: DataElements.GROUP_BUTTON },
      { dataElement: DataElements.UNGROUP_BUTTON },
      { dataElement: DataElements.FORM_FIELD_EDIT_BUTTON },
      { dataElement: DataElements.CALIBRATION_POPUP_BUTTON },
      { dataElement: DataElements.LINK_BUTTON },
      { dataElement: DataElements.FILE_ATTACHMENT_DOWNLOAD },
      { dataElement: DataElements.ANNOTATION_DELETE_BUTTON },
      { dataElement: DataElements.SHORTCUT_KEYS_FOR_3D },
      { dataElement: DataElements.PLAY_SOUND_BUTTON },
      { dataElement: DataElements.OPEN_ALIGNMENT_BUTTON },
    ]);
  });

  test('add coerces a single item into an array', () => {
    seedItems([{ dataElement: 'a' }]);
    const api = createPopupAPI(store, popup);

    const single = { dataElement: 'x' };
    api.add(single, 'a');

    expect(actions.setPopupItems).toHaveBeenCalledWith(popup, [
      { dataElement: 'a' },
      { dataElement: 'x' },
    ]);
  });
});