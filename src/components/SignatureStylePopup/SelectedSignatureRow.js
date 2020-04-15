import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SignatureRowContent from 'components/SignatureStylePopup/SignatureRowContent';
import SignatureAddBtn from 'components/SignatureStylePopup/SignatureAddBtn';
import Icon from 'components/Icon';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';

import './SelectedSignatureRow.scss';

const SelectedSignatureRow = () => {
  const [isToolStyleOpen, selectedSignature, savedSignatures] = useSelector(
    state => [
      selectors.isElementOpen(state, 'toolStylePopup'),
      selectors.getSelectedSignature(state),
      selectors.getSavedSignatures(state),
    ],
  );

  useEffect(() => {
    if (selectedSignature) {
      const signatureTool = core.getTool('AnnotationCreateSignature');
      signatureTool.setSignature(selectedSignature.annotation);
      core.setToolMode('AnnotationCreateSignature');
      // if (signatureTool.hasLocation()) {
      //   signatureTool.addSignature();
      // } else {
        signatureTool.showPreview();
      // }
    }
  }, [selectedSignature]);

  const dispatch = useDispatch();
  return (
    <div
      className="selected-signature-row"
    >
      {selectedSignature ?
        <SignatureRowContent
          imgSrc={selectedSignature.imgSrc}
          isActive
        /> :
        <SignatureAddBtn/>
      }
      <div
        className={classNames({
          "styling-arrow-container": true,
          active: isToolStyleOpen,
          disabled: savedSignatures.length === 0,
        })}
        data-element="styling-button"
        onClick={() => savedSignatures.length > 0 && dispatch(actions.toggleElement('toolStylePopup'))}
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