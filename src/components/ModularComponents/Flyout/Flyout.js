import React, { useCallback, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import './Flyout.scss';
import Icon from 'components/Icon';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_HEIGHT } from 'constants/flyoutConstants';
import { DEFAULT_GAP } from 'constants/customizationVariables';
import getRootNode from 'helpers/getRootNode';
import ZoomText from './flyoutHelpers/ZoomText';
import { getFlyoutPositionOnElement } from 'helpers/flyoutHelper';
import FlyoutItem from 'components/ModularComponents/Flyout/flyoutHelpers/FlyoutItem';
import DataElements from 'src/constants/dataElement';

const Flyout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [
    flyoutMap,
    activeFlyout,
    position,
    toggleElement,
    topHeadersHeight,
    bottomHeadersHeight,
  ] = useSelector((state) => [
    selectors.getFlyoutMap(state),
    selectors.getActiveFlyout(state),
    selectors.getFlyoutPosition(state),
    selectors.getFlyoutToggleElement(state),
    selectors.getTopHeadersHeight(state),
    selectors.getBottomHeadersHeight(state),
  ]);
  const flyoutProperties = flyoutMap[activeFlyout];
  const horizontalHeadersUsedHeight = topHeadersHeight + bottomHeadersHeight + DEFAULT_GAP;
  const {
    dataElement,
    items,
    className
  } = flyoutProperties;
  const [activePath, setActivePath] = useState([]);
  let activeItem = null;
  for (const index of activePath) {
    activeItem = activeItem ? activeItem.children[index] : items[index];
  }
  const flyoutRef = React.createRef();
  const [correctedPosition, setCorrectedPosition] = useState(position);
  const [maxHeightValue, setMaxHeightValue] = useState(window.innerHeight - horizontalHeadersUsedHeight);

  useLayoutEffect(() => {
    const tempRefElement = getRootNode().querySelector(`[data-element="${toggleElement}"]`);
    const correctedPosition = { x: position.x, y: position.y };
    const appRect = getRootNode().getElementById('app').getBoundingClientRect();
    const maxHeightValue = appRect.height - horizontalHeadersUsedHeight;
    setMaxHeightValue(maxHeightValue);

    // Check if the elment is in the dom or invisible
    if (tempRefElement && tempRefElement.offsetParent === null) {
      return;
    }

    // Check if toggleElement is not null
    if (toggleElement && tempRefElement) {
      const { x, y } = getFlyoutPositionOnElement(toggleElement, flyoutRef);
      correctedPosition.x = x;
      correctedPosition.y = y;
    } else {
      const correctedPosition = { x: position.x, y: position.y };
      const widthOverflow = position.x + flyoutRef.current?.offsetWidth - appRect.width;
      const maxElementHeight = activeItem && activeItem.children.length > items.length ? activeItem.children.length : items.length;
      const heightOverflow = position.y + maxElementHeight * (FLYOUT_ITEM_HEIGHT + 8) - appRect.height;
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
    }
    setCorrectedPosition(correctedPosition);
  }, [activeItem, position, items]);


  const closeFlyout = useCallback(() => {
    dispatch(actions.closeElements([activeFlyout]));
  }, [dispatch, activeFlyout]);

  const onClickOutside = useCallback(
    (e) => {
      const menuButton = getRootNode().querySelector(`[data-element="${toggleElement}"]`);
      const clickedMenuButton = menuButton?.contains(e.target);
      if (!clickedMenuButton) {
        closeFlyout();
      }
    },
    [closeFlyout, toggleElement],
  );

  useOnClickOutside(flyoutRef, onClickOutside);

  const onClickHandler = (flyoutItem, isChild, index) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (flyoutItem.children && flyoutItem !== activeItem) {
      const newActivePath = [...activePath];
      newActivePath.push(index);
      setActivePath(newActivePath);
    }
    if (flyoutItem.onClick) {
      try {
        flyoutItem.onClick();
      } catch (error) {
        console.error(error);
      }
      if (!flyoutItem.children && dataElement !== DataElements.VIEWER_CONTROLS_FLYOUT) {
        closeFlyout();
      }
    }
  };

  const renderBackButton = () => {
    const isZoomOptions = activeItem.dataElement === 'zoomOptionsButton';
    return <div className="back-button-container" onClick={() => {
      const newActivePath = [...activePath];
      newActivePath.pop();
      setActivePath(newActivePath);
    }}>
      <Icon glyph="icon-chevron-left" />
      {isZoomOptions ? <ZoomText /> : <div className="back-button-label">{t('action.back')}</div>}
    </div>;
  };

  const flyoutStyles = {
    left: correctedPosition.x,
    top: correctedPosition.y,
    maxHeight: maxHeightValue
  };

  return ((!activeItem && !items.length) ? null :
    <div className="Flyout" data-element={dataElement} ref={flyoutRef} style={flyoutStyles}>
      <div id="FlyoutContainer"
        className={classNames({
          'FlyoutContainer': true,
          [className]: true
        })}>
        {activeItem ? (
          <>
            {renderBackButton()}
            {activeItem.children.map(((activeChild, index) => <FlyoutItem
              flyoutItem={activeChild} index={index} key={activeChild?.dataElement || index}
              isChild={true} onClickHandler={onClickHandler} activeItem={activeItem} items={items}
              activeFlyout={activeFlyout}
            />))}
          </>
        ) :
          items.map((flyoutItem, index) => <FlyoutItem
            flyoutItem={flyoutItem} index={index} key={flyoutItem?.dataElement || index}
            isChild={false} onClickHandler={onClickHandler} activeItem={activeItem} items={items}
            activeFlyout={activeFlyout}
          />)
        }
      </div>
    </div>
  );
};

export default Flyout;
