import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dropdown2 from 'components/Dropdown2/Dropdown.js';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';

import Measure from 'react-measure';

import "./Ribbons.scss";

const Ribbons = ({ screens, currentScreen, setToolbarScreen }) => {
  const [t] = useTranslation();
  const [ribbonsWidth, setRibbonsWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hasEnoughSpace, setHasEnoughSpace] = useState(false);

  const handleWindowResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    // TODO: This constant is the left icons in the header times 2
    // Ideally calculate this or let the someone override it with an API call.
    const remainingSpace = windowWidth - 2 * (736 / 2);
    if (remainingSpace - ribbonsWidth > 0) {
      setHasEnoughSpace(true);
    } else {
      setHasEnoughSpace(false);
    }
  }, [ribbonsWidth, windowWidth]);

  return (
    <React.Fragment>
      <Measure
        bounds
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
            {Object.keys(screens).map(key =>
              <div
                key={key}
                className={classNames({
                  "ribbon-group": true,
                  "active": key === currentScreen,
                })}
                onClick={() => {
                  setToolbarScreen(key);
                }}
              >
                {t(`option.toolbarScreen.${key}`)}
              </div>)}
          </div>
        )}
      </Measure>
      <div
        className={classNames({
          "ribbons": true,
          "is-hidden": hasEnoughSpace,
        })}
      >
        <Dropdown2
          items={Object.keys(screens)}
          translationPrefix="option.toolbarScreen"
          currentSelectionKey={currentScreen}
          onClickItem={screen => {
            setToolbarScreen(screen);
          }}
        />
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  screens: state.viewer.headers.tools,
  currentScreen: selectors.getScreen(state),
});

const mapDispatchToProps = {
  setToolbarScreen: actions.setToolbarScreen,
};

const ConnectedRibbons = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ribbons);

export default ConnectedRibbons;