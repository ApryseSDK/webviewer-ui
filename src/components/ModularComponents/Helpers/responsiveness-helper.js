import React from 'react';
import { DIRECTION, ALIGNMENT } from 'constants/customizationVariables';
import Icon from 'components/Icon';

export const isThereAvailableSpace = (itemsShown, parentRect, headerDirection, alignment) => {
  const firstItemRect = itemsShown[0]?.getBoundingClientRect();
  const lastItemRect = itemsShown[itemsShown.length - 1]?.getBoundingClientRect();
  const isHorizontalHeader = headerDirection === DIRECTION.ROW;

  const lastItemEnd = isHorizontalHeader ? lastItemRect?.right : lastItemRect?.bottom;
  const parentRectEnd = isHorizontalHeader ? parentRect?.right : parentRect?.bottom;
  const firstItemStart = isHorizontalHeader ? firstItemRect?.left : firstItemRect?.top;
  const parentRectStart = isHorizontalHeader ? parentRect?.left : parentRect?.top;

  const availableSpace = alignment !== ALIGNMENT.END ? (parentRectEnd - lastItemEnd) : (firstItemStart - parentRectStart);

  return availableSpace;
};

const removeItemsFromArray = (itemsToRemove, oldArray) => {
  const arrayBackup = [...oldArray];
  itemsToRemove.forEach((item) => {
    const index = oldArray.findIndex((element) => element.sortIndex === item.sortIndex);
    arrayBackup.splice(index, 1);
  });
  return arrayBackup;
};

export const getResponsiveItems = (itemsToChange, previousItems, isAdding) => {
  if (isAdding) {
    return [...previousItems, ...itemsToChange].sort((a, b) => a.sortIndex - b.sortIndex);
  }
  return removeItemsFromArray(itemsToChange, previousItems);
};

export const getItemsToHide = (items, itemsDom, missingSpace, headerDirection) => {
  let spaceToFree = missingSpace;
  const allItems = [...items];
  const itemsToHide = [];
  while (spaceToFree <= 0 && allItems.length > 1) {
    const lastItem = allItems.pop();
    itemsToHide.push(lastItem);
    const lastItemDom = Array.from(itemsDom).find((item) => item.children[0].getAttribute('data-element') === lastItem.dataElement);
    const lastItemSpace = headerDirection === DIRECTION.ROW ? lastItemDom.getBoundingClientRect().width : lastItemDom.getBoundingClientRect().height;
    spaceToFree += (lastItemSpace);
  }
  return itemsToHide;
};

export const getIconDOMElement = (currentItem, allItems) => {
  const areAllitemsWithoutIcons = allItems.every((item) => !item.icon && !item.img);
  if (areAllitemsWithoutIcons) {
    return null;
  }

  const iconElement = currentItem.icon ? currentItem.icon : currentItem.img;
  return iconElement ? <Icon className="menu-icon" glyph={iconElement} /> :
    <div className="menu-icon"></div>;
};

export const getSubMenuDOMElement = (currentItem, allItems) => {
  const areAllitemsWithoutSubMenus = allItems.every((item) => !item.children);
  if (areAllitemsWithoutSubMenus) {
    return null;
  }

  return currentItem.children ? <Icon className="icon-open-submenu" glyph="icon-chevron-right" /> : <div className="icon-open-submenu"></div>;
};
