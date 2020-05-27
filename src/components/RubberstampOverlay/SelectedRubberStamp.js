import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ToolsDropdown from 'components/ToolsDropdown';
import selectors from 'selectors';
import actions from 'actions';

import './SelectedRubberStamp.scss';

const SelectedSignatureRow = () => {
  const [isToolStyleOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'toolStylePopup'),
    ],
  );

  const dispatch = useDispatch();
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