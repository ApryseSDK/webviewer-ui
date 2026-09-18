import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import './LoadingSkeleton.scss';

const ToolbarGroup = () => (
  <div className="LoadingSkeleton__toolbar-group">
    <div className="LoadingSkeleton__block LoadingSkeleton__toolbar-button" />
    <div className="LoadingSkeleton__block LoadingSkeleton__toolbar-button" />
    <div className="LoadingSkeleton__block LoadingSkeleton__toolbar-button" />
  </div>
);

const TextLine = ({ width = 'full' }) => (
  <div className={`LoadingSkeleton__block LoadingSkeleton__text-line LoadingSkeleton__text-line--${width}`} />
);

TextLine.propTypes = {
  width: PropTypes.oneOf(['full', '98', '94', '91', '82', '80', '66', '60', '50']),
};

const LoadingSkeleton = ({ ariaLabel, variant = 'full' }) => {
  const [t] = useTranslation();
  const isViewerVariant = variant === 'viewer';

  return (
    <div
      className={classNames('LoadingSkeleton', {
        'LoadingSkeleton--viewer': isViewerVariant,
      })}
      aria-busy="true"
    >
      <output
        aria-busy="true"
        aria-label={ariaLabel || t('message.loadingDocument')}
        className="visually-hidden"
      />
      <div className="LoadingSkeleton__layout" aria-hidden="true">
        {!isViewerVariant && (
          <div className="LoadingSkeleton__toolbar">
            <ToolbarGroup />
            <div className="LoadingSkeleton__block LoadingSkeleton__toolbar-title" />
            <ToolbarGroup />
          </div>
        )}

        <div className="LoadingSkeleton__document-container">
          <div className="LoadingSkeleton__page">
            <div className="LoadingSkeleton__block LoadingSkeleton__title" />

            <div className="LoadingSkeleton__metadata">
              <div className="LoadingSkeleton__block LoadingSkeleton__metadata-item LoadingSkeleton__metadata-item--short" />
              <div className="LoadingSkeleton__block LoadingSkeleton__metadata-item" />
            </div>

            <div className="LoadingSkeleton__paragraph">
              <TextLine />
              <TextLine />
              <TextLine width="91" />
              <TextLine width="66" />
            </div>

            <div className="LoadingSkeleton__section">
              <div className="LoadingSkeleton__block LoadingSkeleton__heading LoadingSkeleton__heading--large" />
              <div className="LoadingSkeleton__paragraph">
                <TextLine />
                <TextLine />
                <TextLine width="98" />
                <TextLine width="80" />
                <TextLine width="50" />
              </div>
            </div>

            <div className="LoadingSkeleton__section LoadingSkeleton__section--list">
              <div className="LoadingSkeleton__block LoadingSkeleton__heading" />
              <div className="LoadingSkeleton__list">
                <div className="LoadingSkeleton__list-item">
                  <div className="LoadingSkeleton__bullet" />
                  <TextLine width="94" />
                </div>
                <div className="LoadingSkeleton__list-item">
                  <div className="LoadingSkeleton__bullet" />
                  <TextLine width="82" />
                </div>
                <div className="LoadingSkeleton__list-item">
                  <div className="LoadingSkeleton__bullet" />
                  <TextLine />
                </div>
              </div>
            </div>

            <div className="LoadingSkeleton__paragraph LoadingSkeleton__paragraph--footer">
              <TextLine />
              <TextLine width="60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoadingSkeleton.propTypes = {
  ariaLabel: PropTypes.string,
  variant: PropTypes.oneOf(['full', 'viewer']),
};

export default LoadingSkeleton;
