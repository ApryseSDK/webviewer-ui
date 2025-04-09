import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import './TopHeader.scss';
import ModularHeader from '../ModularHeader';
import FloatingHeaderContainer from '../FloatingHeader';
import { PLACEMENT, POSITION } from 'constants/customizationVariables';
import useResizeObserver from 'hooks/useResizeObserver';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash/debounce';

const TopHeaderContainer = () => {

  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);
  const topHeaders = useSelector(selectors.getTopHeaders, shallowEqual);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { customizableUI } = featureFlags;
  // Top headers can be either normal headers, or floating headers. You can have a max of two normal headers.
  // There is one float container that can hold as many floating headers as you want.

  // We first filter out the normal headers
  const fullLengthHeaders = topHeaders.filter((header) => !header.float);
  // Only two headers can be added to the top
  if (fullLengthHeaders.length > 2) {
    console.warn(`Top headers only support two full length headers but ${fullLengthHeaders.length} were added. Only the first two will be rendered.`);
  }

  // Sort the headers by position and take only the first two
  const sortedTopHeaders = useMemo(() => fullLengthHeaders
    .sort((a) => (a.position === POSITION.START ? -1 : 1))
    .slice(0, 2), [fullLengthHeaders]);

  const floatingHeaders = topHeaders.filter((header) => header.float);

  const [elementRef, dimensions] = useResizeObserver();

  // Debounced function to set the top floating container height
  const setTopFloatingContainerHeight = debounce((height) => {
    dispatch(actions.setTopFloatingContainerHeight(height));
  }, 200);

  useEffect(() => {
    if (dimensions.height !== null && floatingHeaders.length > 0) {
      setTopFloatingContainerHeight(dimensions.height);
    }
  }, [dimensions, floatingHeaders.length]);

  const modularHeaders = useMemo(() => sortedTopHeaders.map((header, index) => {
    const { dataElement } = header;
    const autoHide = index === 0 ? false : header.autoHide;
    return (
      <ModularHeader {...header} key={dataElement} autoHide={autoHide}/>
    );
  }), [sortedTopHeaders]);

  if (!customizableUI || !topHeaders.length) {
    return null;
  }

  return (
    <nav aria-label={t('accessibility.landmarks.topHeader')}>
      {modularHeaders}
      <FloatingHeaderContainer floatingHeaders={floatingHeaders} placement={PLACEMENT.TOP} ref={elementRef} />
    </nav>
  );
};

export default TopHeaderContainer;
