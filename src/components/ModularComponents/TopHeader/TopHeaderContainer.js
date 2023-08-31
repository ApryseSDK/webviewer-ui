import React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import './TopHeader.scss';
import ModularHeader from '../ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import { PLACEMENT, POSITION } from 'constants/customizationVariables';

const TopHeaderContainer = () => {
  const [
    featureFlags,
    topHeaders,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getTopHeaders(state)
    ]);
  const { customizableUI } = featureFlags;

  // Top headers can be either normal headers, or floating headers. You can have a max of two normal headers.
  // There is one float container that can hold as many floating headers as you want.

  // We first filter out the normal headers
  const fullLengthHeaders = topHeaders.filter((header) => !header.float);
  // Only two headers can be added to the top
  if (fullLengthHeaders.length > 2) {
    console.warn(`Top headers only support two full length headers but ${fullLengthHeaders.length} were added. Only the first two will be rendered.`);
  }

  // We sort the top headers by their order: start and end
  const sortedTopHeaders = fullLengthHeaders.reduce((sortedHeaders, header, index) => {
    if (index > 1) {
      return sortedHeaders;
    }

    const { position } = header;
    if (position === POSITION.START) {
      sortedHeaders.unshift(header);
    } else {
      sortedHeaders.push(header);
    }
    return sortedHeaders;
  }, []);

  // Now we filter out the floating headers
  const floatingHeaders = topHeaders.filter((header) => header.float);

  if (customizableUI) {
    const modularHeaders = sortedTopHeaders.map((header, index) => {
      const { dataElement } = header;
      const autohide = index === 0 ? false : header.autohide;
      return (
        <ModularHeader {...header} key={dataElement} autohide={autohide} />
      );
    });
    return (
      <div>
        {modularHeaders}
        <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.TOP} />
      </div>
    );
  }
  return null;
};

export default TopHeaderContainer;