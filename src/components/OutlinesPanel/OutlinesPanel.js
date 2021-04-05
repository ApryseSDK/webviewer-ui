import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Outline from 'components/Outline';
import OutlineContext from 'components/Outline/Context';
import Icon from 'components/Icon';

import core from 'core';
import outlineUtils from 'helpers/OutlineUtils';
import selectors from 'selectors';

import './OutlinesPanel.scss';

function OutlinesPanel() {
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, 'outlinesPanel'));
  const outlines = useSelector(state => selectors.getOutlines(state));
  const [selectedOutlinePath, setSelectedOutlinePath] = useState(null);
  const [t] = useTranslation();
  const dispatch = useDispatch();

  return isDisabled ? null : (
    <div className="Panel OutlinesPanel" data-element="outlinesPanel">
      <OutlineContext.Provider
        value={{
          setSelectedOutlinePath,
          selectedOutlinePath,
          isOutlineSelected: outline => outlineUtils.getPath(outline) === selectedOutlinePath,
        }}
      >
        {outlines.length === 0 && (
          <div className="no-outlines">
            <div>
              <Icon className="empty-icon" glyph="illustration - empty state - outlines" />
            </div>
            <div className="msg">{t('message.noOutlines')}</div>
          </div>
        )}
        {outlines.map((outline) => (
          <Outline key={outlineUtils.getOutlineId(outline)} outline={outline} />
        ))}
      </OutlineContext.Provider>
    </div>
  );
}

export default React.memo(OutlinesPanel);
