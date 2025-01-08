function createItemsForBookmarkOutlineFlyout(menuItems, type, shouldHideDeleteButton, handleOnClick, menuTypes) {
  const hiddenRules = {
    [menuTypes.DELETE]: () => shouldHideDeleteButton,
    [menuTypes.DOWNLOAD]: () => type !== 'portfolio',
    [menuTypes.OPENFILE]: () => type !== 'portfolio',
    [menuTypes.SETDEST]: () => type !== 'outline',
    [menuTypes.OPENFORMFIELDPANEL]: () => ['portfolio', 'bookmark'].includes(type),
    [menuTypes.MOVE_LEFT]: () => type !== 'outline',
    [menuTypes.MOVE_RIGHT]: () => type !== 'outline',
    [menuTypes.MOVE_UP]: () => type !== 'outline' && type !== 'portfolio',
    [menuTypes.MOVE_DOWN]: () => type !== 'outline' && type !== 'portfolio',
  };

  return menuItems.map((item) => {
    const { option } = item;
    const hidden = hiddenRules[option] ? hiddenRules[option]() : false;

    return {
      ...item,
      hidden,
      dataElement: `${type}${item.dataElement}`,
      onClick: () => handleOnClick(item.option),
    };
  });
}

export default createItemsForBookmarkOutlineFlyout;