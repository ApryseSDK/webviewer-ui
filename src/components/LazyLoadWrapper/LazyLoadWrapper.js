import React, { Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import DataElements from 'constants/dataElement';

// Map that tracks if the element has been opened before
const openedElementsMap = new Map();
// Elements in this list will stay in the DOM after opened for the first time
// So the status of these elements will not be discarded when closed
const elementsList = [DataElements.SEARCH_PANEL];
elementsList.forEach((dataElement) => {
  openedElementsMap.set(dataElement, false);
});
const elementWasOpened = (dataElement) => openedElementsMap.has(dataElement) && openedElementsMap.get(dataElement);

const LazyLoadWrapper = ({
  Component,
  dataElement,
  onOpenHook = () => { },
  ...passedInProps
}) => {
  const onOpenProps = onOpenHook();
  const isOpen = useSelector((state) => selectors.isElementOpen(state, dataElement));
  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));

  useEffect(() => {
    if (isOpen && openedElementsMap.has(dataElement) && !openedElementsMap.get(dataElement)) {
      openedElementsMap.set(dataElement, true);
    }
  }, [isOpen]);

  return (isDisabled || !(isOpen || elementWasOpened(dataElement))) ? null : (
    <Suspense fallback={<></>}>
      <Component
        dataElement={dataElement}
        {...onOpenProps}
        {...passedInProps}
      />
    </Suspense>
  );
};

export default LazyLoadWrapper;
