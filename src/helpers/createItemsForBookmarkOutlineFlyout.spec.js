import createItemsForBookmarkOutlineFlyout from './createItemsForBookmarkOutlineFlyout';
import { menuItems, menuTypes } from './outlineFlyoutHelper';

describe('createItemsForBookmarkOutlineFlyout tests', () => {
  it('should return the correct options for outlines panel', () => {
    const itemsForOutlines = createItemsForBookmarkOutlineFlyout(menuItems, 'outline', false, jest.fn(), menuTypes);
    const hiddenElements = itemsForOutlines.filter((item) => item.hidden);

    const expectedHiddenElements = [
      menuTypes.OPENFORMFIELDPANEL,
      menuTypes.OPENFILE,
      menuTypes.DOWNLOAD,
    ];
    expect(hiddenElements.map((item) => item.option)).toEqual(expectedHiddenElements);
    expect(hiddenElements.length).toEqual(3);
  });

  it('should return the correct options for bookmarks panel', () => {
    const itemsForBookmark = createItemsForBookmarkOutlineFlyout(menuItems, 'bookmark', false, jest.fn(), menuTypes);
    const hiddenElements = itemsForBookmark.filter((item) => item.hidden);

    const expectedHiddenElements = [
      menuTypes.OPENFORMFIELDPANEL,
      menuTypes.OPENFILE,
      menuTypes.SETDEST,
      menuTypes.DOWNLOAD,
      menuTypes.MOVE_UP,
      menuTypes.MOVE_DOWN,
      menuTypes.MOVE_LEFT,
      menuTypes.MOVE_RIGHT,
    ];
    expect(hiddenElements.map((item) => item.option)).toEqual(expectedHiddenElements);
    expect(hiddenElements.length).toEqual(8);
  });

  it('should return the correct options for portfolio panel', () => {
    const itemsForPortfolio = createItemsForBookmarkOutlineFlyout(menuItems, 'portfolio', false, jest.fn(), menuTypes);

    const hiddenElements = itemsForPortfolio.filter((item) => item.hidden);

    const expectedHiddenElements = [
      menuTypes.OPENFORMFIELDPANEL,
      menuTypes.SETDEST,
      menuTypes.MOVE_LEFT,
      menuTypes.MOVE_RIGHT,
    ];
    expect(hiddenElements.map((item) => item.option)).toEqual(expectedHiddenElements);
    expect(hiddenElements.length).toEqual(4);
  });

  it('should return the correct options for form field list panel', () => {
    const itemsForPortfolio = createItemsForBookmarkOutlineFlyout(menuItems, 'indexPanel', false, jest.fn(), menuTypes);
    const hiddenElements = itemsForPortfolio.filter((item) => item.hidden);

    const expectedHiddenElements = [
      menuTypes.OPENFILE,
      menuTypes.SETDEST,
      menuTypes.DOWNLOAD,
      menuTypes.MOVE_UP,
      menuTypes.MOVE_DOWN,
      menuTypes.MOVE_LEFT,
      menuTypes.MOVE_RIGHT,
    ];
    expect(hiddenElements.map((item) => item.option)).toEqual(expectedHiddenElements);
    expect(hiddenElements.length).toEqual(7);
  });
});