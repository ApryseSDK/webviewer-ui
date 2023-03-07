import React, { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import './Flyout.scss';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_HEIGHT, WIDTH_PLUS_PADDING } from 'constants/flyoutConstants';


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
  } = flyoutProperties;
  const [activeItem, setActiveItem] = useState(null);
  const flyoutRef = React.createRef();
  const [correctedPosition, setCorrectedPosition] = useState(position);

  useEffect(() => {
    const correctedPosition = { x: position.x, y: position.y };
    const appRect = document.getElementById('app').getBoundingClientRect();
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
    dispatch(actions.setActiveFlyout(undefined));
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

  const renderFlyoutItem = (flyoutItem, isChild = false) => {
    return (flyoutItem === 'divider' ? <div className="divider"/> : (
      <div key={flyoutItem.label} className="flyout-item-container" onClick={onClickHandler(flyoutItem, isChild)}>
        <div className="menu-container">
          {flyoutItem.icon && <Icon className="menu-icon" glyph={flyoutItem.icon}/>}
          <div className="flyout-item-label">{flyoutItem.label}</div>
        </div>
        {flyoutItem.children && <Icon className="icon-open-submneu" glyph="icon-chevron-right"/>}
      </div>
    ));
  };

  const flyoutStyles = {
    left: correctedPosition.x,
    top: correctedPosition.y,
  };

  return (
    <div className="Flyout" data-element={dataElement} ref={flyoutRef} style={flyoutStyles}>
      <div className="FlyoutContainer">
        {activeItem ? (
          <>
            <div className="back-button-container" onClick={() => setActiveItem(null)}>
              <Icon glyph="icon-chevron-left"/>
              <div className="back-button-label">{t('action.back')}</div>
            </div>
            {activeItem.children.map(((activeChild) => renderFlyoutItem(activeChild, true)))}
          </>
        ) :
          items.map((flyoutItem) => renderFlyoutItem(flyoutItem))
        }
      </div>
    </div>
  );
};

export default Flyout;
