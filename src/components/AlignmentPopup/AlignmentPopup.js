import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ActionButton from 'components/ActionButton';

import './AlignmentPopup.scss';

const propTypes = {
  alignmentConfig: PropTypes.array,
  alignmentOnClick: PropTypes.func,
  backToMenuOnClick: PropTypes.func,
  distributeConfig: PropTypes.array,
  distributeOnClick: PropTypes.func,
  isAnnotation: PropTypes.bool,
};

const AlignmentPopup = ({
  alignmentConfig,
  alignmentOnClick,
  backToMenuOnClick,
  distributeConfig,
  distributeOnClick,
  isAnnotation
}) => {
  const [t] = useTranslation();

  const renderButtonRow = (title, config, onClick) => {
    return (
      <div className='button-row-container'>
        <div>{t(title)}</div>
        <div className="button-row">
          {config.map((config) => (
            <ActionButton
              key={config.title}
              className="main-menu-button"
              title={t(config.title)}
              img={config.icon}
              onClick={() => {
                onClick(config.alignment);
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderTopSection = () => (
    <div className="top-section">
      <div className="button-row">
        <ActionButton
          className="back-to-menu-button"
          dataElement="backToMenuButton"
          title={t('action.backToMenu')}
          img="ic_chevron_left_black_24px"
          onClick={backToMenuOnClick}
        />
        <div role="button" type="button" tabIndex="0" onClick={backToMenuOnClick} onKeyDown={backToMenuOnClick}>{t('action.backToMenu')}</div>
      </div>
    </div>
  );

  const renderContents = () => (
    <div className="contents">
      {renderTopSection()}
      <div className="divider" />
      {renderButtonRow('alignmentPopup.alignment', alignmentConfig, alignmentOnClick)}
      {renderButtonRow('alignmentPopup.distribute', distributeConfig, distributeOnClick)}
    </div>
  );

  if (!isAnnotation) {
    return null;
  }

  return (
    <div
      data-testid="alignment-annotation-element"
      className={classNames({
        Popup: true,
        AlignAnnotationPopup: true,
        'is-horizontal': true
      })}
    >
      {renderContents()}
    </div>
  );
};

AlignmentPopup.propTypes = propTypes;

export default AlignmentPopup;