import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Outline from 'components/Outline';
import Icon from 'components/Icon';

import core from 'core';
import selectors from 'selectors';

import './OutlinesPanel.scss';

function OutlinesPanel() {
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, 'outlinesPanel'));
  const outlines = useSelector(state => selectors.getOutlines(state));
  const [t] = useTranslation();
  const dispatch = useDispatch();

  return isDisabled ? null : (
    <div className="Panel OutlinesPanel" data-element="outlinesPanel">
      {outlines.length === 0 &&
        <div className="no-outlines">
          <div>
            <Icon
              className="empty-icon"
              glyph="illustration - empty state - outlines"
            />
          </div>
          <div className="msg">
            {t('message.noOutlines')}
          </div>
        </div>
      }
      {outlines.map((outline, i) => (
        <Outline key={i} outline={outline} />
      ))}
    </div>
  );
}

export default React.memo(OutlinesPanel);