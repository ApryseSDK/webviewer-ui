import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import './TopHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';
import { getTopHeaders } from 'helpers/headers';

const TopHeaderContainer = () => {
  const [
    featureFlags,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
    ]);
  const { modularHeader } = featureFlags;

  const topHeaders = getTopHeaders();

  if (modularHeader && topHeaders.length) {
    return topHeaders.map((header) => {
      const { options } = header;
      return (
        <ModularHeader {...options} key={options.dataElement} />
      );
    });
  }
  return null;
};

export default TopHeaderContainer;