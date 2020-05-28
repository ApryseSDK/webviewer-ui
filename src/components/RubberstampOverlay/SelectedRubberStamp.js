import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import ToolsDropdown from 'components/ToolsDropdown';
import selectors from 'selectors';
import actions from 'actions';

import './SelectedRubberStamp.scss';

const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const SelectedSignatureRow = () => {
  const dispatch = useDispatch();
  const [t, i18n] = useTranslation();
  const prevLanguage = usePrevious(i18n.language);

  useEffect(() => {
    dispatch(actions.setDefaultStamps(t));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const isLanguageChanged = prevLanguage !== i18n.language;
    if (isLanguageChanged) {
      dispatch(actions.setDefaultStamps(t));
    }
  });

  const [isToolStyleOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'toolStylePopup'),
    ],
  );

  return (
    <div
      className="selected-rubber-stamp-container"
    >
      <div
        className="selected-rubber-stamp"
      >
        test
      </div>
      <ToolsDropdown
        onClick={() => dispatch(actions.toggleElement('toolStylePopup'))}
        isActive={isToolStyleOpen}
      />
    </div>
  );
};

export default SelectedSignatureRow;