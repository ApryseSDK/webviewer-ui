import React from 'react';
import { connect } from 'react-redux';

import Dropdown2 from 'components/Dropdown2/Dropdown.js';

import actions from 'actions';
import selectors from 'selectors';
import { withTranslation } from 'react-i18next';

import "./Ribbons.scss";

const Ribbons = ({ screens, currentScreen, setToolbarScreen, closeElements, t }) => {

  return (
    <div
      className="Ribbons"
    >
      {/* {screens.map(({ key, translationKey }) =>
        <div
          key={key}
          className="ribbon-group"
        >
          {t(translationKey)}
        </div>)} */}
      <Dropdown2
        items={screens}
        currentSelectionKey={currentScreen}
        onClickItem={screen => {
          setToolbarScreen(screen);
        }}
      />
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
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
    // {
    //   key: 'Insert',
    //   translationKey: 'option.toolbarScreen.Insert',
    // },
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
  closeElements: actions.closeElements,
};

const ConnectedRibbons = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Ribbons));

export default ConnectedRibbons;