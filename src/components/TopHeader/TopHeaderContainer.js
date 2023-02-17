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
  // Only two headers can be added to the top
  if (topHeaders.length > 2) {
    console.warn(`Top headers only support two headers but ${topHeaders.length} were added. Only the first two will be rendered.`);
  }

  // We sort the top headers by their order: start and end
  const sortedTopHeaders = topHeaders.reduce((sortedHeaders, header, index) => {
    if (index > 1) {
      return sortedHeaders;
    }

    const { options } = header;
    const { position } = options;
    if (position === 'start') {
      sortedHeaders.unshift(header);
    } else {
      sortedHeaders.push(header);
    }
    return sortedHeaders;
  }, []);

  if (modularHeader && sortedTopHeaders.length) {
    return sortedTopHeaders.map((header, index) => {
      const { options } = header;
      const autohide = index === 0 ? false : options.autohide;
      return (
        <ModularHeader {...options} key={options.dataElement} autohide={autohide} />
      );
    });
  }
  return null;
};

export default TopHeaderContainer;