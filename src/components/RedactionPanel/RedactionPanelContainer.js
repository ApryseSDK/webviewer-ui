import React, { useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import RedactionPanel from './RedactionPanel';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import applyRedactions from 'helpers/applyRedactions';
import { RedactionPanelContext, RedactionPanelProvider } from './RedactionPanelContext';
import { isMobileSize } from 'helpers/getDeviceSize';
import DataElementWrapper from '../DataElementWrapper';
import Icon from 'components/Icon';
import RedactionSearchPanel from 'components/RedactionSearchPanel';
import { defaultRedactionTypes } from 'constants/redactionTypes';

export const RedactionPanelContainer = (props) => {
  const [
    isOpen,
    isDisabled,
    redactionPanelWidth,
    isInDesktopOnlyMode,
    customApplyRedactionsHandler,
    redactionSearchPatterns,
  ] = useSelector(
    (state) => [
      selectors.isElementOpen(state, 'redactionPanel'),
      selectors.isElementDisabled(state, 'redactionPanel'),
      selectors.getRedactionPanelWidth(state),
      selectors.isInDesktopOnlyMode(state),
      selectors.getCustomApplyRedactionsHandler(state),
      selectors.getRedactionSearchPatterns(state),
    ],
    shallowEqual,
  );

  const isMobile = isMobileSize();

  const { redactionAnnotationsList, isCustomPanel, dataElement } = props;

  const redactionTypesDictionary = useMemo(() => {
    const storedRedactionTypes = Object.keys(redactionSearchPatterns).reduce((map, key) => {
      const { label, type, icon } = redactionSearchPatterns[key];
      map[type] = {
        label,
        icon,
      };
      return map;
    }, {});

    return { ...storedRedactionTypes, ...defaultRedactionTypes };
  }, [redactionSearchPatterns]);

  const deleteAllRedactionAnnotations = () => {
    core.deleteAnnotations(redactionAnnotationsList);
  };

  const dispatch = useDispatch();
  const applyAllRedactions = () => {
    const originalApplyRedactions = () => {
      const callOnRedactionCompleted = isCustomPanel ? closeRedactionPanel : () => {};
      dispatch(applyRedactions(redactionAnnotationsList, callOnRedactionCompleted));
    };
    if (customApplyRedactionsHandler) {
      customApplyRedactionsHandler(redactionAnnotationsList, originalApplyRedactions);
    } else {
      originalApplyRedactions();
    }
  };

  const closeRedactionPanel = () => {
    const tempDataElement = isCustomPanel ? dataElement : 'redactionPanel';
    dispatch(actions.closeElement(tempDataElement));
  };

  const renderMobileCloseButton = () => {
    return (
      !isCustomPanel && (
        <div className="close-container">
          <div className="close-icon-container" onClick={closeRedactionPanel}>
            <Icon glyph="ic_close_black_24px" className="close-icon" />
          </div>
        </div>
      )
    );
  };

  const style = isCustomPanel || (!isInDesktopOnlyMode && isMobile)
    ? {}
    : { width: `${redactionPanelWidth}px`, minWidth: `${redactionPanelWidth}px` };

  const { isRedactionSearchActive } = useContext(RedactionPanelContext);

  const [renderNull, setRenderNull] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderNull(!isOpen);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (isDisabled || (!isOpen && renderNull && !isCustomPanel)) {
    return null;
  }

  const dataElementToUse = isCustomPanel ? dataElement : 'redactionPanel';

  return (
    <DataElementWrapper dataElement={dataElementToUse} className="Panel RedactionPanel" style={style}>
      {!isInDesktopOnlyMode && isMobile && renderMobileCloseButton()}
      <RedactionSearchPanel />
      {!isRedactionSearchActive && (
        <RedactionPanel
          redactionAnnotations={redactionAnnotationsList}
          redactionTypesDictionary={redactionTypesDictionary}
          applyAllRedactions={applyAllRedactions}
          deleteAllRedactionAnnotations={deleteAllRedactionAnnotations}
        />
      )}
    </DataElementWrapper>
  );
};

RedactionPanelContainer.propTypes = {
  redactionAnnotationsList: PropTypes.array,
  isCustomPanel: PropTypes.bool,
  dataElement: PropTypes.string,
};

RedactionPanelContainer.defaultProps = {
  isCustomPanel: false,
  dataElement: '',
};

const RedactionPanelContainerWithProvider = (props) => {
  return (
    <RedactionPanelProvider>
      <RedactionPanelContainer {...props} />
    </RedactionPanelProvider>
  );
};

export default RedactionPanelContainerWithProvider;
