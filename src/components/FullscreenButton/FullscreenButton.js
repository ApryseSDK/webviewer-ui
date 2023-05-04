import React from 'react';
import ActionButton from 'components/ActionButton';
import toggleFullscreen from 'helpers/toggleFullscreen';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';

export default function FullscreenButton() {
  const [t] = useTranslation();
  const isFullScreen = useSelector(selectors.isFullScreen);

  return (
    <ActionButton
      dataElement="fullscreenButton"
      className="row"
      img={isFullScreen ? 'icon-header-full-screen-exit' : 'icon-header-full-screen'}
      ariaLabel={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
      title={isFullScreen ? t('action.exitFullscreen') : t('action.enterFullscreen')}
      role="option"
      onClick={toggleFullscreen}
    />
  );
}
