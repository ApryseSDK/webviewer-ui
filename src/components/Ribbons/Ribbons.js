import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dropdown from 'components/Dropdown';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';

import Measure from 'react-measure';

import "./Ribbons.scss";

const Ribbons = ({ screens, currentScreen, setToolbarScreen }) => {
  const [t] = useTranslation();
  const [ribbonsWidth, setRibbonsWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);
  const ribbonsRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (ribbonsRef?.current && containerRef?.current) {
      const ribbonsRight = ribbonsRef.current.getBoundingClientRect().right;
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      const remainingSpace = ribbonsRight - containerLeft;
      if (remainingSpace - ribbonsWidth > 0) {
        setHasEnoughSpace(true);
      } else {
        setHasEnoughSpace(false);
      }
    }
  }, [ribbonsWidth, containerWidth, ribbonsRef, containerRef]);

  if (screens.length <= 1) {
    return null;
  }

  return (
    <Measure
      bounds
      innerRef={containerRef}
      onResize={({ bounds }) => {
        setContainerWidth(bounds.width);
      }}
    >
      {({ measureRef }) => (
        <div
          className="ribbons-container"
          ref={measureRef}
        >
          <Measure
            bounds
            innerRef={ribbonsRef}
            onResize={({ bounds }) => {
              setRibbonsWidth(bounds.width);
            }}
          >
            {({ measureRef }) => (
              <div
                ref={measureRef}
                className={classNames({
                  "ribbons": true,
                  "is-hidden": !hasEnoughSpace,
                })}
              >
                {screens.map(key =>
                  <button
                    key={key}
                    data-element={`screen-${key}`}
                    className={classNames({
                      "ribbon-group": true,
                      "active": key === currentScreen,
                    })}
                    onClick={() => {
                      setToolbarScreen(key);
                    }}
                  >
                    {t(`option.toolbarScreen.${key}`)}
                  </button>)}
              </div>
            )}
          </Measure>
          <div
            className={classNames({
              "ribbons": true,
              "is-hidden": hasEnoughSpace,
            })}
          >
            <Dropdown
              items={screens}
              translationPrefix="option.toolbarScreen"
              currentSelectionKey={currentScreen}
              onClickItem={screen => {
                setToolbarScreen(screen);
              }}
            />
          </div>
        </div>
      )}
    </Measure>
  );
};

const mapStateToProps = state => ({
  screens: selectors.getEnabledScreens(state),
  currentScreen: selectors.getCurrentScreen(state),
});

const mapDispatchToProps = {
  setToolbarScreen: actions.setToolbarScreen,
};

const ConnectedRibbons = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ribbons);

export default ConnectedRibbons;