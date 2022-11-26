import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import selectors from 'selectors';
import useMedia from 'hooks/useMedia';
import Icon from 'components/Icon';
import actions from 'actions';
import './Panel.scss';
import { panelMinWidth } from 'constants/panel';

const Panel = (props) => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const [
    currentWidth,
    isInDesktopOnlyMode,
    isOpen,
    isDisabled,
  ] = useSelector(
    (state) => [
      selectors.getPanelWidth(state, props.dataElement),
      selectors.isInDesktopOnlyMode(state),
      selectors.isElementOpen(state, props.dataElement),
      selectors.isElementDisabled(state, props.dataElement),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();

  let style = {};
  if (currentWidth && (isInDesktopOnlyMode || !isMobile)) {
    style = { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  } else {
    style = { minWidth: `${panelMinWidth}px` };
  }
  const isVisible = !(!isOpen || isDisabled);
  const isLeftSide = (!props.location) ? true : props.location === 'left';
  const isRightSide = props.location === 'right';

  return (
    <div
      className={classNames({
        'flx-Panel': true,
        'closed': !isVisible,
        'left': isLeftSide,
        'right': isRightSide,
      })}
      data-element={props.dataElement}
    >
      <div className='flx-Panel-container' style={style}>
        {!isInDesktopOnlyMode && isMobile &&
          <div
            className="close-container"
          >
            <div
              className="close-icon-container"
              onClick={() => {
                dispatch(actions.closeElements([props.dataElement]));
              }}
            >
              <Icon
                glyph="ic_close_black_24px"
                className="close-icon"
              />
            </div>
          </div>}
        { props.children }
      </div>
    </div>
  );
};

export default Panel;
