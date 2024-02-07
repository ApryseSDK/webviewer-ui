import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import './TopHeader.scss';
import ModularHeader from '../ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import { PLACEMENT, POSITION } from 'constants/customizationVariables';
import useResizeObserver from 'hooks/useResizeObserver';
import actions from 'actions';

const TopHeaderContainer = () => {
  const [
    featureFlags,
    topHeaders,
  ] = useSelector(
    (state) => [
      selectors.getFeatureFlags(state),
      selectors.getTopHeaders(state),
    ]);
  const dispatch = useDispatch();
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

  const floatingHeaders = topHeaders.filter((header) => header.float);

  const [elementRef, dimensions] = useResizeObserver();
  useEffect(() => {
    if (dimensions.height !== null && floatingHeaders.length > 0) {
      dispatch(actions.setTopFloatingContainerHeight(dimensions.height));
    }
  }, [dimensions, floatingHeaders.length]);

  if (customizableUI) {
    const modularHeaders = sortedTopHeaders.map((header, index) => {
      const { dataElement } = header;
      const autoHide = index === 0 ? false : header.autoHide;
      return (
        <ModularHeader {...header} key={dataElement} autoHide={autoHide} />
      );
    });
    return (
      <div>
        {modularHeaders}
        <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.TOP} ref={elementRef} />
      </div>
    );
  }
  return null;
};

export default TopHeaderContainer;