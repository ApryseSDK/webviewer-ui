import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignatureRowContent from 'components/SignatureStylePopup/SignatureRowContent';
import Icon from 'components/Icon';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';

import './SelectedSignatureRow.scss';

const SelectedSignatureRow = props => {
  const [isToolStyleOpen] = useSelector(
    state => [
      selectors.isElementOpen(state, 'toolStylePopup'),
      // selectors.getSelectedSignature(state),
    ],
  );
  const dispatch = useDispatch();

  return (
    <div
      className="selected-signature-row"
    >
      <SignatureRowContent/>
      <div
        className={classNames({
          "styling-arrow-container": true,
          active: isToolStyleOpen,
        })}
        data-element="styling-button"
        onClick={() => dispatch(actions.toggleElement('toolStylePopup'))}
      >
        <Icon glyph="icon-menu-style-line" />
        {isToolStyleOpen ?
          <Icon className="styling-arrow-up" glyph="icon-chevron-up" /> :
          <Icon className="styling-arrow-down" glyph="icon-chevron-down" />}
      </div>
    </div>
  );
};

export default SelectedSignatureRow;