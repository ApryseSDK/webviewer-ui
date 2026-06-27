import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';

import actions from 'actions';
import selectors from 'selectors';
import Icon from 'components/Icon';
import Button from 'components/Button';
import COMPONENT_TYPES from 'constants/componentTypes';

import './ErrorBoundaryComponent.scss';

const COMPONENT_TYPE_VALUES = Object.values(COMPONENT_TYPES);

function DefaultFallback({ componentType, onReload, onClose }) {
  const { t } = useTranslation();
  const resolvedComponentType = t(`message.renderErrors.componentType.${componentType ?? COMPONENT_TYPES.COMPONENT}`);
  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <Icon className="error-boundary-icon" glyph="ic-error" />
        <div className="error-boundary-messages" role="alert">
          <div className="error-boundary-primary-message">{t('message.renderErrors.error')}</div>
          <div className="error-boundary-secondary-message">
            {t('message.renderErrors.toFixIssue', { componentType: resolvedComponentType })}
          </div>
        </div>
        <div className="error-boundary-actions">
          <Button
            className="error-boundary-reload-button"
            dataElement="errorBoundaryReloadButton"
            label={t('action.reload')}
            onClick={onReload}
          />
          <Button
            className="error-boundary-close-button"
            dataElement="errorBoundaryCloseButton"
            label={t('action.close')}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}

DefaultFallback.propTypes = {
  componentType: PropTypes.oneOf(COMPONENT_TYPE_VALUES),
  onReload: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

function ErrorBoundaryComponent(props) {
  const { children, componentType, dataElement } = props;

  const dispatch = useDispatch();
  const activeDocumentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);

  const handleError = (error, errorInfo) => {
    console.error(`${dataElement} crashed`, error, errorInfo);
  };

  const renderFallback = ({ resetErrorBoundary }) => {
    const handleReload = () => {
      dispatch(actions.closeElements([dataElement]));
      setTimeout(() => dispatch(actions.openElement(dataElement)), 0);
      resetErrorBoundary();
    };
    const handleClose = () => {
      dispatch(actions.closeElements([dataElement]));
      resetErrorBoundary();
    };
    return (
      <DefaultFallback
        componentType={componentType}
        onReload={handleReload}
        onClose={handleClose}
      />
    );
  };

  return (
    <ErrorBoundary
      onError={handleError}
      resetKeys={[dataElement, activeDocumentViewerKey]}
      fallbackRender={renderFallback}
    >
      {children}
    </ErrorBoundary>
  );
}

ErrorBoundaryComponent.propTypes = {
  children: PropTypes.node,
  componentType: PropTypes.oneOf(COMPONENT_TYPE_VALUES),
  dataElement: PropTypes.string.isRequired,
};

export default ErrorBoundaryComponent;
