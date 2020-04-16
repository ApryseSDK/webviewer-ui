import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import Icon from 'components/Icon';
import SignatureRowContent from './SignatureRowContent';
import SignatureAddBtn from './SignatureAddBtn';
import core from 'core';
import actions from 'actions';
import defaultTool from 'constants/defaultTool';

import './SignatureStylePopup.scss';

const SignatureStylePopup = props => {
  const { t } = props;
  const [activeToolName, savedSignatures, selectedSignatureIndex] = useSelector(
    state => [
      selectors.getActiveToolName(state),
      selectors.getSavedSignatures(state),
      selectors.getSelectedSignatureIndex(state),
    ],
  );

  const signatureTool = core.getTool('AnnotationCreateSignature');
  const dispatch = useDispatch();

  const setSignature = index => {
    dispatch(actions.setSelectedSignatureIndex(index));
    const { annotation } = savedSignatures[index];
    signatureTool.setSignature(annotation);
    core.setToolMode('AnnotationCreateSignature');
    if (signatureTool.hasLocation()) {
      signatureTool.addSignature();
    } else {
      signatureTool.showPreview();
    }
  };

  const deleteSignature = index => {
    signatureTool.deleteSavedSignature(index);

    const isDeletingSelectedSignature = selectedSignatureIndex === index;
    if (isDeletingSelectedSignature) {
      dispatch(actions.setSelectedSignatureIndex(0));
      signatureTool.annot = null;
      signatureTool.hidePreview();
      core.setToolMode(defaultTool);
      if (savedSignatures.length === 1) {
        dispatch(actions.closeElements(['toolStylePopup']));
      }
    } else if (index < selectedSignatureIndex) {
      dispatch(actions.setSelectedSignatureIndex(selectedSignatureIndex - 1));
    }
  };

  return (
    <div
      className="signature-style-popup"
    >
      {savedSignatures.map(({ imgSrc }, i) =>
        <div
          key={i}
          className="signature-row"
        >
          <SignatureRowContent
            onClick={() => setSignature(i)}
            imgSrc={imgSrc}
            isActive={selectedSignatureIndex === i && activeToolName === 'AnnotationCreateSignature'}
          />
          <div
            className="icon"
            dataElement="defaultSignatureDeleteButton"
            onClick={() => deleteSignature(i)}
          >
            <Icon glyph="icon-delete-line"/>
          </div>
        </div>
      )}
      <SignatureAddBtn
        disabled={savedSignatures.length >= 4}
      />
    </div>
  );
};

export default withTranslation()(SignatureStylePopup);