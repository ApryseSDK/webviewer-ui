import React from 'react';
import RedactionPanel from './RedactionPanel';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import applyRedactions from 'helpers/applyRedactions';
import { RedactionPanelProvider } from './RedactionPanelContext';
import useOnRedactionAnnotationChanged from '../../hooks/useOnRedactionAnnotationChanged';
import useMedia from 'hooks/useMedia';

const RedactionPanelContainer = () => {
  const [
    isOpen,
    isDisabled,
    redactionPanelWidth,
    isInDesktopOnlyMode
  ] = useSelector(
    state => [
      selectors.isElementOpen(state, 'redactionPanel'),
      selectors.isElementDisabled(state, 'redactionPanel'),
      selectors.getRedactionPanelWidth(state),
      selectors.isInDesktopOnlyMode(state)
    ],
    shallowEqual,
  );

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const redactionAnnotationsList = useOnRedactionAnnotationChanged();

  const deleteAllRedactionAnnotations = () => {
    core.deleteAnnotations(redactionAnnotationsList);
  };

  const dispatch = useDispatch();
  const applyAllRedactions = () => {
    dispatch(applyRedactions(redactionAnnotationsList));
  };
  const closeRedactionPanel = () => {
    dispatch(actions.closeElement('redactionPanel'));
  };

  if (isDisabled || !isOpen) {
    return null;
  } else {
    return (
      <RedactionPanel
        redactionAnnotations={redactionAnnotationsList}
        isInDesktopOnlyMode={isInDesktopOnlyMode}
        isMobile={isMobile}
        currentWidth={redactionPanelWidth}
        applyAllRedactions={applyAllRedactions}
        deleteAllRedactionAnnotations={deleteAllRedactionAnnotations}
        closeRedactionPanel={closeRedactionPanel} />
    );
  }
};

const RedactionPanelContainerWithProvider = () => {
  return (
    <RedactionPanelProvider>
      <RedactionPanelContainer />
    </RedactionPanelProvider>
  )
}

export default RedactionPanelContainerWithProvider;