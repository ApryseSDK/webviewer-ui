import React from 'react';
import TrackChangeOverlay from 'src/components/TrackChangeOverlay';
import DataElements from 'constants/dataElement';

const OfficeEditorModeDropdown = () => {
  return (
    <TrackChangeOverlay dataElement={DataElements.TRACK_CHANGE_OVERLAY_BUTTON} />
  );
};

export default OfficeEditorModeDropdown;