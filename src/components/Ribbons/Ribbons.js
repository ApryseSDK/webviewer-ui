import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Dropdown2 from 'components/Dropdown2/Dropdown.js';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import useMedia from 'hooks/useMedia';

import "./Ribbons.scss";

const Ribbons = ({ screens, currentScreen, setToolbarScreen }) => {
  const [t] = useTranslation();
  const hasEnoughSpace = useMedia(
    // Media queries
    ['(min-width: 1250px)'],
    [true],
    // Default value
    false,
  );

  return (
    <div
      className="Ribbons"
    >
      {hasEnoughSpace ?
        screens.map(({ key, translationKey }) =>
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
            {t(translationKey)}
          </div>) :
        <Dropdown2
          items={screens}
          currentSelectionKey={currentScreen}
          onClickItem={screen => {
            setToolbarScreen(screen);
          }}
        />
      }
    </div>
  );
};

const mapStateToProps = state => ({
  screens: [
    {
      key: 'View',
      translationKey: 'option.toolbarScreen.View',
    },
    {
      key: 'Annotate',
      translationKey: 'option.toolbarScreen.Annotate',
    },
    {
      key: 'Draw',
      translationKey: 'option.toolbarScreen.Draw',
    },
    {
      key: 'Fill&Sign',
      translationKey: 'option.toolbarScreen.Fill&Sign',
    },
    {
      key: 'Measure',
      translationKey: 'option.toolbarScreen.Measure',
    },
    {
      key: 'Edit',
      translationKey: 'option.toolbarScreen.Edit',
    },
  ],
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