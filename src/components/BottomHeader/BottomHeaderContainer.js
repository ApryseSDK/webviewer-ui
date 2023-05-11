import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import './BottomHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';

const BottomHeaderContainer = () => {
  const [
    featureFlags,
    bottomHeaders
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getBottomHeaders(state)
    ]);
  const { modularHeader } = featureFlags;

  if (modularHeader && bottomHeaders.length) {
    return <div className="bottom-headers-wrapper">
      {
        bottomHeaders.map((header) => {
          const { dataElement } = header;
          return (
            <ModularHeader {...header} key={dataElement} />
          );
        })
      }
    </div>;
  }
  return null;
};

export default BottomHeaderContainer;