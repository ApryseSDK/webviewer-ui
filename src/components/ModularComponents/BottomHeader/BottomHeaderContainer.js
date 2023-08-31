import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import './BottomHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import DataElementWrapper from '../../DataElementWrapper';
import { PLACEMENT } from 'constants/customizationVariables';

const BottomHeaderContainer = () => {
  const [
    featureFlags,
    bottomHeaders
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getBottomHeaders(state)
    ]);
  const { customizableUI } = featureFlags;

  const floatingHeaders = bottomHeaders.filter((header) => header.float);
  const fullLengthHeader = bottomHeaders.filter((header) => !header.float);


  if (customizableUI) {
    const modularHeaders = fullLengthHeader.map((header) => {
      const { dataElement } = header;
      return (
        <ModularHeader {...header} key={dataElement} />
      );
    });
    return (
      <DataElementWrapper dataElement="bottom-headers" className="bottom-headers-wrapper">
        <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.BOTTOM} />
        {modularHeaders}
      </DataElementWrapper>
    );
  }
  return null;
};

export default BottomHeaderContainer;