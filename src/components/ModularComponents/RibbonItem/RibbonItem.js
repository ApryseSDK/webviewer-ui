import React, { useEffect, useRef, useState } from 'react';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import actions from 'actions';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import classNames from 'classnames';
import { JUSTIFY_CONTENT, DIRECTION } from 'constants/customizationVariables';

import './RibbonItem.scss';
import sizeManager from 'helpers/responsivnessHelper';
import { innerItemToFlyoutItem } from 'helpers/itemToFlyoutHelper';
import core from 'core';

const RibbonItem = (props) => {
  const elementRef = useRef();
  const { t } = useTranslation();
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
    iconDOMElement
  } = props;
  const [
    activeGroupedItems,
    activeCustomRibbon,
    lastPickedToolForGroupedItems,
    isRibbonItemDisabled,
  ] = useSelector((state) => [
    selectors.getActiveGroupedItems(state),
    selectors.getActiveCustomRibbon(state),
    selectors.getLastPickedToolForGroupedItems(state, groupedItems),
    selectors.isElementDisabled(state, dataElement),
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
    const allActiveGroupedItemsBelongToCurrentRibbonItem = activeGroupedItems?.every((item) => groupedItems.includes(item));
    if (activeCustomRibbon === dataElement && (allActiveGroupedItemsBelongToCurrentRibbonItem || !activeGroupedItems?.length)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [activeGroupedItems, activeCustomRibbon]);

  const onClick = () => {
    if (!isActive) {
      dispatch(actions.setActiveGroupedItems(groupedItems));
      dispatch(actions.setActiveCustomRibbon(dataElement));
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

  return (
    isFlyoutItem ?
      (
        innerItemToFlyoutItem({
          isDisabled: false,
          icon: iconDOMElement,
          label: t(label),
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
            label={label}
            title={title}
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
