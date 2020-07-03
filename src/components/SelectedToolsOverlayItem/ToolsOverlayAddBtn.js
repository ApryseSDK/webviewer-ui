import React from 'react';
import classNames from 'classnames';
import { withTranslation } from 'react-i18next';

import './ToolsOverlayAddBtn.scss';

const ToolsOverlayAddBtn = ({ t, onClick, textTranslationKey }) => {
  return (
    <div
      className={classNames({
        'tools-overlay-add-btn': true,
      })}
      onClick={onClick}
    >
      {t(textTranslationKey)}
    </div>
  );
};

export default withTranslation()(ToolsOverlayAddBtn);