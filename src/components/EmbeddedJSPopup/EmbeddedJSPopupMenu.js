import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import EmbeddedJSPopupOption from './EmbeddedJSPopupOption';
import EmbeddedJSPopupSubMenu from './EmbeddedJSPopupSubMenu';

import actions from 'actions';
import core from 'core';
import selectors from 'selectors';

const EmbeddedJSPopupMenu = React.forwardRef(({ dataElement, isSubOpen, left = 0, top = 0, onSelectOption, popUpMenuItems }, ref) => {
  if (!isSubOpen || !popUpMenuItems || popUpMenuItems.length <= 0) {
    return <></>;
  }

  const [
    embeddedJSPopupStyle,
  ] = useSelector((state) => [
    selectors.getEmbeddedJSPopupStyle(state),
  ], shallowEqual);

  const scrollContainer = core.getScrollViewElement();
  const dispatch = useDispatch();
  const containerRef = useRef();

  // Adjust scrolling based on distance from bottom
  const [maxHeight, setMaxHeight] = useState('auto');
  // Options need to know how much to shift by if there is scrolling
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (isSubOpen) {
      dispatch(actions.closeElements(['annotationPopup', 'textPopup']));
    }
    const containerRect = containerRef.current.getBoundingClientRect();
    // Update the menu size if it is too long
    const mHeight = containerRect.bottom >= scrollContainer.clientHeight ? containerRect.height - (containerRect.bottom - scrollContainer.clientHeight) : null;
    setMaxHeight(mHeight);
  }, [dispatch, isSubOpen]);

  const onScrollContainer = (e) => {
    if (e.target === containerRef.current) {
      setScrollTop(e.target.scrollTop);
    }
  };

  const customMenuStyle = embeddedJSPopupStyle || {};

  return (
    <div
      ref={ref}
      className={classNames({
        Popup: true,
        EmbeddedJSPopup: true,
        open: isSubOpen,
        closed: !isSubOpen,
      })}
      style={{ left, top, flexDirection: 'column' }}
      data-element={dataElement}
    >
      <div ref={containerRef} style={{ overflowY: 'auto', maxHeight, ...customMenuStyle }} onScroll={onScrollContainer}>
        {
          popUpMenuItems.map((popUpMenuItem, index) => {
            if (typeof popUpMenuItem === 'string' || popUpMenuItem instanceof String) {
              return (
                <EmbeddedJSPopupOption
                  key={`${popUpMenuItem}_${index}`}
                  title={popUpMenuItem}
                  onClick={onSelectOption}
                />
              );
            }
            if (Array.isArray(popUpMenuItem)) {
              return (
                <EmbeddedJSPopupSubMenu
                  key={`${popUpMenuItem[0]}_${index}`}
                  title={popUpMenuItem[0]}
                  scrollTop={scrollTop}
                  onClick={onSelectOption}
                  popUpMenuItems={popUpMenuItem.slice(1)}
                />
              );
            }
            return null;
          })
        }
      </div>
    </div>
  );
});

EmbeddedJSPopupMenu.displayName = 'EmbeddedJSPopupMenu';

export default EmbeddedJSPopupMenu;
