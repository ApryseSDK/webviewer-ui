import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const LazyLoadWrapper = ({
  Component,
  dataElement,
  hook = () => {},
}) => {
  const data = hook();
  const isOpen = useSelector((state) => selectors.isElementOpen(state, dataElement));

  return !isOpen ? null : (
    <Suspense fallback={<></>}>
      <Component
        {...data}
      />
    </Suspense>
  );
};

export default LazyLoadWrapper;
