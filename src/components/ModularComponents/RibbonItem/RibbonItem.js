import React, { useEffect, useRef } from 'react';
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
    toolbarGroup,
    groupedItems = [],
    direction,
    justifyContent,
    isFlyoutItem,
    iconDOMElement
  } = props;
  const [currentToolbarGroup] = useSelector((state) => [
    selectors.getCurrentToolbarGroup(state),
  ]);

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
    if (currentToolbarGroup === toolbarGroup) {
      dispatch(actions.setCustomRibbon(toolbarGroup));
      const activeGroups = groupedItems.map((item) => item?.dataElement);
      dispatch(actions.setCurrentGroupedItem(activeGroups));
    }
  }, []);

  const isActive = currentToolbarGroup === toolbarGroup;

  const onClick = () => {
    if (!isActive) {
      dispatch(actions.setCustomRibbon(toolbarGroup));
      const activeGroups = groupedItems.map((item) => item?.dataElement);
      dispatch(actions.setCurrentGroupedItem(activeGroups));
    }
  };

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
  getCurrentToolbarGroup: PropTypes.func,
  toolbarGroup: PropTypes.string,
  groupedItems: PropTypes.array,
  direction: PropTypes.string,
  justifyContent: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.any,
};

export default RibbonItem;
