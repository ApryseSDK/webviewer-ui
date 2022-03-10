import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import Icon from 'components/Icon'

import DataElementWrapper from '../DataElementWrapper';
import './RedactionPanel.scss'
import RedactionPageGroup from '../RedactionPageGroup';

const RedactionPanel = (props) => {
  const {
    redactionAnnotations,
    currentWidth,
    isInDesktopOnlyMode,
    applyAllRedactions,
    deleteAllRedactionAnnotations,
    isMobile = false,
    closeRedactionPanel,
  } = props;

  const { t } = useTranslation();
  const style = !isInDesktopOnlyMode && isMobile ? {} : { width: `${currentWidth}px`, minWidth: `${currentWidth}px` };
  const [redactionPageMap, setRedactionPageMap] = useState({});

  useEffect(() => {
    const redactionPageMap = {};
    redactionAnnotations.forEach(annotation => {
      const pageNumber = annotation.PageNumber;
      if (redactionPageMap[pageNumber] === undefined) {
        redactionPageMap[pageNumber] = [annotation];
      } else {
        redactionPageMap[pageNumber] = [annotation, ...redactionPageMap[pageNumber]];
      }
    });

    setRedactionPageMap(redactionPageMap)

  }, [redactionAnnotations]);

  const renderRedactionPageGroups = () => {
    const pageNumbers = Object.keys(redactionPageMap);
    return (
      <div className="redaction-group-container" role="list">
        {pageNumbers.map(pageNumber => (
          <RedactionPageGroup
            key={pageNumber}
            pageNumber={pageNumber}
            redactionItems={redactionPageMap[pageNumber]}
          />)
        )}
      </div>
    );
  };

  const noRedactionAnnotations = (
    <div className="no-marked-redactions">
      <div>
        <Icon className="empty-icon" glyph="icon-no-marked-redactions" />
      </div>
      <div className="msg">{t('redactionPanel.noMarkedRedactions')}</div>
    </div>
  );

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

  const redactAllButtonClassName = classNames('redact-all-marked', { disabled: redactionAnnotations.length === 0 });
  const clearAllButtonClassName = classNames('clear-all-marked', { disabled: redactionAnnotations.length === 0 });

  return (
    <DataElementWrapper
      dataElement="redactionPanel"
      className="Panel RedactionPanel"
      style={style}
    >
      {(!isInDesktopOnlyMode && isMobile) && renderMobileCloseButton()}
      <div className="marked-redaction-counter">
        <span>{t('redactionPanel.redactionCounter')}</span> {`(${redactionAnnotations.length})`}
      </div>
      {redactionAnnotations.length > 0 ? renderRedactionPageGroups() : noRedactionAnnotations}
      <div className="redaction-panel-controls">
        <button
          disabled={redactionAnnotations.length === 0}
          className={clearAllButtonClassName}
          onClick={deleteAllRedactionAnnotations}>
          {t('redactionPanel.clearMarked')}
        </button>
        <button
          disabled={redactionAnnotations.length === 0}
          className={redactAllButtonClassName}
          onClick={applyAllRedactions}>
          {t('redactionPanel.redactAllMarked')}
        </button>
      </div>
    </DataElementWrapper>
  );
};

export default RedactionPanel;