import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import classNames from 'classnames';
import getToolbarTranslationString from 'helpers/translationKeyMapping';
import { JUSTIFY_CONTENT, DIRECTION } from 'constants/customizationVariables';
import defaultTool from 'constants/defaultTool';
import './RibbonItem.scss';
import sizeManager from 'helpers/responsivenessHelper';
import { getNestedGroupedItems, assignToolToGroups } from 'helpers/modularUIHelpers';
import core from 'core';
import FlyoutItemContainer from '../FlyoutItemContainer';

const RibbonItem = forwardRef((props, ref) => {
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
    toolbarGroup,
    ariaCurrent
  } = props;

  const activeGroupedItems = useSelector(selectors.getActiveGroupedItems);
  const activeCustomRibbon = useSelector(selectors.getActiveCustomRibbon);
  const lastPickedToolForGroupedItems = useSelector((state) => selectors.getLastPickedToolForGroupedItems(state, groupedItems));
  const isRibbonItemDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const customHeadersAdditionalProperties = useSelector((state) => selectors.getCustomHeadersAdditionalProperties(state));
  const allAssociatedGroupedItems = useSelector((state) => [...groupedItems, ...getNestedGroupedItems(state, groupedItems)], shallowEqual);
  const firstRibbonItemTool = useSelector((state) => selectors.getFirstToolForGroupedItems(state, allAssociatedGroupedItems));

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
    if (activeCustomRibbon === dataElement && (someActiveGroupedItemsBelongToCurrentRibbonItem || !allAssociatedGroupedItems?.length)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [activeGroupedItems, activeCustomRibbon, lastPickedToolForGroupedItems]);

  const onClick = useCallback(() => {
    if (groupedItems.length < 1) {
      core.setToolMode(defaultTool);
    }
    if (!isActive) {
      const ribbonItemTool = lastPickedToolForGroupedItems === defaultTool ? firstRibbonItemTool : lastPickedToolForGroupedItems;
      dispatch(actions.setAppStateAfterToolModeChanged(ribbonItemTool, {
        activeCustomRibbon: dataElement,
        activeGroupedItems: allAssociatedGroupedItems,
        lastPickedToolAndGroup: { tool: ribbonItemTool, group: allAssociatedGroupedItems },
        lastPickedToolForGroupedItems: assignToolToGroups(ribbonItemTool, allAssociatedGroupedItems),
      }));

      setIsActive(true);
      core.setToolMode(ribbonItemTool);

      if (groupedItems.length < 1) {
        core.getFormFieldCreationManager().endFormFieldCreationMode();
        core.getContentEditManager().endContentEditMode();
      }
    }
  }, [activeGroupedItems, activeCustomRibbon]);

  if (isRibbonItemDisabled) {
    return null;
  }

  const translatedLabel = tReady && toolbarGroup ?
    t(getToolbarTranslationString(toolbarGroup, customHeadersAdditionalProperties))
    : label;

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={onClick} />
      :
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
          ariaCurrent={ariaCurrent}
        >
        </Button>
      </div>
  );
});

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
  toolbarGroup: PropTypes.string,
  ariaCurrent: PropTypes.string,
};
RibbonItem.displayName = 'RibbonItem';

export default React.memo(RibbonItem);