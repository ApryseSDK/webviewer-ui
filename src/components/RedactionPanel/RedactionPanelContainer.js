import React, { useContext, useMemo } from 'react';
import RedactionPanel from './RedactionPanel';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import applyRedactions from 'helpers/applyRedactions';
import { RedactionPanelContext, RedactionPanelProvider } from './RedactionPanelContext';
import useOnRedactionAnnotationChanged from '../../hooks/useOnRedactionAnnotationChanged';
import useMedia from 'hooks/useMedia';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon'
import RedactionSearchPanel from 'components/RedactionSearchPanel';
import { defaultRedactionTypes } from 'constants/redactionTypes';

export const RedactionPanelContainer = () => {
  const [
    isOpen,
    isDisabled,
    redactionPanelWidth,
    isInDesktopOnlyMode,
    customApplyRedactionsHandler,
    redactionSearchPatterns,
  ] = useSelector(
    state => [
      selectors.isElementOpen(state, 'redactionPanel'),
      selectors.isElementDisabled(state, 'redactionPanel'),
      selectors.getRedactionPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
      selectors.getCustomApplyRedactionsHandler(state),
      selectors.getRedactionSearchPatterns(state),
    ], shallowEqual);

  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  const redactionAnnotationsList = useOnRedactionAnnotationChanged();

  const redactionTypesDictionary = useMemo(() => {
    const storedRedactionTypes = Object.keys(redactionSearchPatterns).reduce((map, key) => {
      const { label, type, icon } = redactionSearchPatterns[key];
      map[type] = {
        label,
        icon
      };
      return map;
    }, {})

    return { ...storedRedactionTypes, ...defaultRedactionTypes };
  }, [redactionSearchPatterns]);

  const deleteAllRedactionAnnotations = () => {
    core.deleteAnnotations(redactionAnnotationsList);
  };

  const dispatch = useDispatch();
  const applyAllRedactions = () => {
    const originalApplyRedactions = () => {
      dispatch(applyRedactions(redactionAnnotationsList));
    };
    if (customApplyRedactionsHandler) {
      customApplyRedactionsHandler(redactionAnnotationsList, originalApplyRedactions);
    } else {
      originalApplyRedactions();
    }
  };
  const closeRedactionPanel = () => {
    dispatch(actions.closeElement('redactionPanel'));
  };

  const renderMobileCloseButton = () => {
    return (
      <div
        className="close-container"
      >
        <div
          className="close-icon-container"
          onClick={closeRedactionPanel}
        >
          <Icon
            glyph="ic_close_black_24px"
            className="close-icon"
          />
        </div>
      </div>
    );
  };

  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${redactionPanelWidth}px`, minWidth: `${redactionPanelWidth}px`, };

  const { isRedactionSearchActive } = useContext(RedactionPanelContext);

  if (isDisabled || !isOpen) {
    return null;
  } else {
    return (
      <DataElementWrapper
        dataElement="redactionPanel"
        className="Panel RedactionPanel"
        style={style}
      >
        {(!isInDesktopOnlyMode && isMobile) && renderMobileCloseButton()}
        <RedactionSearchPanel />
        {!isRedactionSearchActive &&
          <RedactionPanel
            redactionAnnotations={redactionAnnotationsList}
            redactionTypesDictionary={redactionTypesDictionary}
            applyAllRedactions={applyAllRedactions}
            deleteAllRedactionAnnotations={deleteAllRedactionAnnotations} />}
      </DataElementWrapper>
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