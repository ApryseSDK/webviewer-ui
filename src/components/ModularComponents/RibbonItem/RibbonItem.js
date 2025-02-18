import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';
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
    ariaCurrent,
    style,
    className,
  } = props;

  const activeGroupedItems = useSelector(selectors.getActiveGroupedItems);
  const activeCustomRibbon = useSelector(selectors.getActiveCustomRibbon);
  const lastActiveToolForRibbon = useSelector((state) => selectors.getLastActiveToolForRibbon(state, dataElement));
  const isRibbonItemDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));
  const customHeadersAdditionalProperties = useSelector((state) => selectors.getCustomHeadersAdditionalProperties(state));
  const firstRibbonItemTool = useSelector((state) => selectors.getFirstToolForRibbon(state, dataElement));

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
    if (activeCustomRibbon === dataElement) {
      setIsActive(true);
      const ribbonItemTool = lastActiveToolForRibbon === undefined ? firstRibbonItemTool : lastActiveToolForRibbon;
      core.setToolMode(ribbonItemTool);
    } else {
      setIsActive(false);
    }

  }, [activeCustomRibbon, lastActiveToolForRibbon]);

  useEffect(() => {
    if (activeCustomRibbon === dataElement) {
      dispatch(actions.setActiveGroupedItems(groupedItems));
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [activeCustomRibbon, groupedItems]);

  const onClick = useCallback(() => {
    if (groupedItems.length < 1) {
      core.setToolMode(defaultTool);
    }
    if (!isActive) {
      const ribbonItemTool = lastActiveToolForRibbon === undefined ? firstRibbonItemTool : lastActiveToolForRibbon;
      dispatch(actions.setActiveGroupedItems(groupedItems));
      dispatch(actions.setActiveCustomRibbon(dataElement));

      setIsActive(true);

      core.setToolMode(ribbonItemTool);

      if (groupedItems.length < 1) {
        core.getFormFieldCreationManager().endFormFieldCreationMode();
        core.getContentEditManager().endContentEditMode();
      }
    }
  }, [activeGroupedItems, activeCustomRibbon, isActive]);

  if (isRibbonItemDisabled) {
    return null;
  }

  const translatedLabel = tReady && toolbarGroup ?
    t(getToolbarTranslationString(toolbarGroup, customHeadersAdditionalProperties))
    : label;

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={onClick}
        label={translatedLabel}
        title={translatedLabel || title}
      />
      :
      <div className={classNames({
        'RibbonItem': true,
        'vertical': direction === DIRECTION.COLUMN,
        'horizontal': direction === DIRECTION.ROW,
        'left': justifyContent !== JUSTIFY_CONTENT.END,
        'right': justifyContent === JUSTIFY_CONTENT.END,
        [className]: true,
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
          style={style}
          className={className}
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
  style: PropTypes.object,
  className: PropTypes.string,
};
RibbonItem.displayName = 'RibbonItem';

export default React.memo(RibbonItem);