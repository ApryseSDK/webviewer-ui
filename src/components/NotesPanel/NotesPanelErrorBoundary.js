import React from 'react';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

import Icon from 'components/Icon';
import WarningBanner from 'components/WarningBanner/WarningBanner';

function NotesPanelFallback({ t }) {
  return (
    <div
      className={classNames('notes-panel-container', {
        'notes-panel-container--error': true,
      })}
    >
      <WarningBanner
        className="NotesPanelWarningBanner"
        primaryMessage={`${t('message.renderErrors.error')}`}
        secondaryMessage={t('message.renderErrors.refreshPanel')}
      />
      <div
        className={classNames({
          Panel: true,
          NotesPanel: true,
        })}
        data-element="notesPanel"
      >
        <div className="no-annotations">
          <div>
            <Icon className="empty-icon" glyph="illustration - empty state - outlines" />
          </div>
          <div className="msg">{t('message.noAnnotations')}</div>
        </div>
      </div>
    </div>
  );
}

NotesPanelFallback.propTypes = {
  t: PropTypes.func,
};

function NotesPanelErrorBoundary(props) {
  const { children, t, resetKey } = props;

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('NotesPanel crashed', error, errorInfo);
      }}
      resetKeys={[resetKey]}
      fallbackRender={() => (
        <NotesPanelFallback
          t={t}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
}

NotesPanelErrorBoundary.propTypes = {
  children: PropTypes.node,
  resetKey: PropTypes.string,
  t: PropTypes.func,
};

export default withTranslation()(NotesPanelErrorBoundary);
