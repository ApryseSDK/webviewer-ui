import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import TrackChangeOverlay from 'src/components/TrackChangeOverlay';
import DataElements from 'constants/dataElement';

const propTypes = {
  isFlyoutItem: PropTypes.bool,
  onKeyDownHandler: PropTypes.func,
};

const OfficeEditorModeDropdown = (props) => {
  const { isFlyoutItem, onKeyDownHandler } = props;
  const activeFlyout = useSelector(selectors.getActiveFlyout);

  return (
    <TrackChangeOverlay
      dataElement={DataElements.TRACK_CHANGE_OVERLAY_BUTTON}
      isFlyoutItem={isFlyoutItem}
      onKeyDownHandler={onKeyDownHandler}
      activeFlyout={activeFlyout}
    />
  );
};

OfficeEditorModeDropdown.propTypes = propTypes;

export default OfficeEditorModeDropdown;