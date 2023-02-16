import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import './BottomHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import { getBottomHeaders } from 'helpers/headers';

const BottomHeaderContainer = () => {
  const [
    featureFlags,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
    ]);
  const { modularHeader } = featureFlags;

  const bottomHeaders = getBottomHeaders();

  if (modularHeader && bottomHeaders.length) {
    return <div className="bottom-headers-wrapper">
      {
        bottomHeaders.map((header) => {
          const { options } = header;
          return (
            <ModularHeader {...options} key={options.dataElement} />
          );
        })
      }
    </div>;
  }
  return null;
};

export default BottomHeaderContainer;