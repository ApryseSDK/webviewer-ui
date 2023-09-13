import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import './Flyout.scss';
import Icon from 'components/Icon';
import ToolButton from 'components/ToolButton';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_HEIGHT, WIDTH_PLUS_PADDING } from 'constants/flyoutConstants';
import getRootNode from 'helpers/getRootNode';
import ZoomText from './Helpers/ZoomText';

const Flyout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [flyoutMap, activeFlyout, position] = useSelector((state) => [
    selectors.getFlyoutMap(state),
    selectors.getActiveFlyout(state),
    selectors.getFlyoutPosition(state),
  ]);
  const flyoutProperties = flyoutMap[activeFlyout];
  const {
    dataElement,
    items,
    className
  } = flyoutProperties;
  const [activeItem, setActiveItem] = useState(null);
  const flyoutRef = React.createRef();
  const [correctedPosition, setCorrectedPosition] = useState(position);

  useEffect(() => {
    const correctedPosition = { x: position.x, y: position.y };
    const appRect = getRootNode().getElementById('app').getBoundingClientRect();

    const widthOverflow = position.x + WIDTH_PLUS_PADDING - appRect.width;
    const heightOverflow = position.y +
      (activeItem && activeItem.children.length > items.length ? activeItem.children.length : items.length) *
      (FLYOUT_ITEM_HEIGHT + 8) - appRect.height;
    if (widthOverflow > 0) {
      correctedPosition.x = position.x - widthOverflow;
    }
    if (heightOverflow > 0) {
      correctedPosition.y = position.y - heightOverflow;
    }
    if (correctedPosition.x < 0) {
      correctedPosition.x = 0;
    }
    if (correctedPosition.y < 0) {
      correctedPosition.y = 0;
    }
    setCorrectedPosition(correctedPosition);
  }, [activeItem, position]);

  const onClickOutside = useCallback(() => {
    dispatch(actions.closeElement(activeFlyout));
  }, [dispatch, activeFlyout]);
  useOnClickOutside(flyoutRef, onClickOutside);

  const onClickHandler = (flyoutItem, isChild) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (flyoutItem.children && flyoutItem !== activeItem && !isChild) {
      setActiveItem(flyoutItem);
    } else if (!isChild) {
      setActiveItem(null);
    }
    if (flyoutItem.onClick) {
      flyoutItem.onClick();
    }
  };

  const renderFlyoutItem = (flyoutItem, index, isChild = false) => {
    const itemIsATool = !!flyoutItem.toolName;
    // Switch statement for special flyout items
    switch (flyoutItem.dataElement) {
      case 'zoomOptionsButton':
        return <div key={flyoutItem.label} className="flyout-item-container zoom-options"
          data-element={flyoutItem.dataElement} onClick={onClickHandler(flyoutItem, isChild)}>
          <div className="menu-container">
            <ZoomText/>
          </div>
          {flyoutItem.children && <Icon className="icon-open-submenu" glyph="icon-chevron-right"/>}
        </div>;
      default:
        return (flyoutItem === 'divider' ? <div className="divider" key={`divider-${index}`}/> : (
          <div key={flyoutItem.label} className="flyout-item-container"
            data-element={flyoutItem.dataElement} onClick={onClickHandler(flyoutItem, isChild)}>
            <div className="menu-container">
              {!itemIsATool && flyoutItem.icon && <Icon className="menu-icon" glyph={flyoutItem.icon}/>}
              {!itemIsATool && <div className="flyout-item-label">{t(flyoutItem.label)}</div>}
              {itemIsATool &&
                // We should update when we have the customizable Tool Button component
                <ToolButton
                  className={classNames({ ZoomItem: true })}
                  role="option"
                  toolName={flyoutItem.toolName}
                  label={flyoutItem.label}
                  img={flyoutItem.icon}
                />}
            </div>
            {flyoutItem.children && <Icon className="icon-open-submenu" glyph="icon-chevron-right"/>}
          </div>
        ));
    }
  };

  const renderBackButton = () => {
    const isZoomOptions = activeItem.dataElement === 'zoomOptionsButton';
    return <div className="back-button-container" onClick={() => setActiveItem(null)}>
      <Icon glyph="icon-chevron-left"/>
      {isZoomOptions ? <ZoomText/> : <div className="back-button-label">{t('action.back')}</div>}
    </div>;
  };

  const flyoutStyles = {
    left: correctedPosition.x,
    top: correctedPosition.y,
  };

  return (
    <div className="Flyout" data-element={dataElement} ref={flyoutRef} style={flyoutStyles}>
      <div className={classNames({
        'FlyoutContainer': true,
        [className]: true
      })}>
        {activeItem ? (
          <>
            {renderBackButton()}
            {activeItem.children.map(((activeChild, index) => renderFlyoutItem(activeChild, index, true)))}
          </>
        ) :
          items.map((flyoutItem, index) => renderFlyoutItem(flyoutItem, index))
        }
      </div>
    </div>
  );
};

export default Flyout;
