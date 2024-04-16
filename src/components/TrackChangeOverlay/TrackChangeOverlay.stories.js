import React from 'react';
import TrackChangeOverlay from './TrackChangeOverlay';

export default {
  title: 'Components/TrackChangeOverlay',
  component: TrackChangeOverlay
};

export function Basic() {
  return (
    <div style={{ width: '150px' }}>
      <TrackChangeOverlay />
    </div>
  );
}
