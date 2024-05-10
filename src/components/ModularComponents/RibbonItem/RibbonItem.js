import React, { useEffect, useRef, useState } from 'react';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import classNames from 'classnames';
import getToolbarTranslationString from 'helpers/translationKeyMapping';
import { JUSTIFY_CONTENT, DIRECTION } from 'constants/customizationVariables';
import defaultTool from 'constants/defaultTool';

import './RibbonItem.scss';
import sizeManager from 'helpers/responsivenessHelper';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import { getNestedGroupedItems } from 'helpers/modularUIHelpers';
import core from 'core';

const RibbonItem = (props) => {
  const elementRef = useRef();
  const { t, ready: tReady } = useTranslation();
  const dispatch = useDispatch();
  const {
    dataElement,
    title,
    disabled,
    img,
    label,
    groupedItems = [],
    direction,
    justifyContent,
    isFlyoutItem,
    iconDOMElement,
    toolbarGroup
  } = props;

  const [
    activeGroupedItems,
    activeCustomRibbon,
    lastPickedToolForGroupedItems,
    isRibbonItemDisabled,
    customHeadersAdditionalProperties,
    allAssociatedGroupedItems,
  ] = useSelector((state) => [
    selectors.getActiveGroupedItems(state),
    selectors.getActiveCustomRibbon(state),
    selectors.getLastPickedToolForGroupedItems(state, groupedItems),
    selectors.isElementDisabled(state, dataElement),
    selectors.getCustomHeadersAdditionalProperties(state),
    [...groupedItems, ...getNestedGroupedItems(state, groupedItems)],
  ]);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (elementRef.current) {
      sizeManager[dataElement] = {
        width: elementRef.current.clientWidth,
        height: elementRef.current.clientHeight,
        visible: true,
      };
    }
  }, []);

  useEffect(() => {
    const someActiveGroupedItemsBelongToCurrentRibbonItem = activeGroupedItems?.some((item) => allAssociatedGroupedItems.includes(item));
    if (activeCustomRibbon === dataElement && (someActiveGroupedItemsBelongToCurrentRibbonItem || !activeGroupedItems?.length)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [activeGroupedItems, activeCustomRibbon, lastPickedToolForGroupedItems]);

  const onClick = () => {
    if (groupedItems.length < 1) {
      core.setToolMode(defaultTool);
    }
    if (!isActive) {
      dispatch(actions.setActiveGroupedItems(allAssociatedGroupedItems));
      dispatch(actions.setActiveCustomRibbon(dataElement));
      dispatch(actions.setLastPickedToolAndGroup({
        tool: lastPickedToolForGroupedItems,
        group: allAssociatedGroupedItems
      }));
      setIsActive(true);
      core.setToolMode(lastPickedToolForGroupedItems);

      if (groupedItems.length < 1) {
        core.getFormFieldCreationManager().endFormFieldCreationMode();
        core.getContentEditManager().endContentEditMode();
      }
    }
  };

  if (isRibbonItemDisabled) {
    return null;
  }

  const translatedLabel = tReady && toolbarGroup ?
    t(getToolbarTranslationString(toolbarGroup, customHeadersAdditionalProperties))
    : label;

  return (
    isFlyoutItem ?
      (
        innerItemToFlyoutItem({
          isDisabled: false,
          icon: iconDOMElement,
          label: translatedLabel,
        }, onClick)
      ) :
      (
        <div className={classNames({
          'RibbonItem': true,
          'vertical': direction === DIRECTION.COLUMN,
          'horizontal': direction === DIRECTION.ROW,
          'left': justifyContent !== JUSTIFY_CONTENT.END,
          'right': justifyContent === JUSTIFY_CONTENT.END,
        })}
        >
          <Button
            isActive={isActive}
            dataElement={dataElement}
            img={img}
            label={translatedLabel}
            title={translatedLabel || title}
            useI18String={false}
            onClick={onClick}
            disabled={disabled}
          >
          </Button>
        </div>
      )
  );
};

RibbonItem.propTypes = {
  dataElement: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
  img: PropTypes.string,
  label: PropTypes.string,
  groupedItems: PropTypes.array,
  direction: PropTypes.string,
  justifyContent: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.any,
};

export default RibbonItem;
