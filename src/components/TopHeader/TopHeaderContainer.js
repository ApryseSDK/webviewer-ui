import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import './TopHeader.scss';
import ModularHeader from 'components/ModularComponents/ModularHeader';

const TopHeaderContainer = () => {
  const [
    featureFlags,
    topHeaders,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getTopHeaders(state)
    ]);
  const { modularHeader } = featureFlags;
  // Only two headers can be added to the top
  if (topHeaders.length > 2) {
    console.warn(`Top headers only support two headers but ${topHeaders.length} were added. Only the first two will be rendered.`);
  }

  // We sort the top headers by their order: start and end
  const sortedTopHeaders = topHeaders.reduce((sortedHeaders, header, index) => {
    if (index > 1) {
      return sortedHeaders;
    }

    const { position } = header;
    if (position === 'start') {
      sortedHeaders.unshift(header);
    } else {
      sortedHeaders.push(header);
    }
    return sortedHeaders;
  }, []);

  if (modularHeader && sortedTopHeaders.length) {
    return sortedTopHeaders.map((header, index) => {
      const { dataElement } = header;
      const autohide = index === 0 ? false : header.autohide;
      return (
        <ModularHeader {...header} key={dataElement} autohide={autohide} />
      );
    });
  }
  return null;
};

export default TopHeaderContainer;