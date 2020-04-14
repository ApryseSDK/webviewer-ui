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

import './SignatureStylePopup.scss';

const SignatureStylePopup = props => {
  const { t } = props;
  const [savedSignatures, selectedSignatureIndex] = useSelector(
    state => [
      selectors.getSavedSignatures(state),
      selectors.getSelectedSignatureIndex(state),
    ],
  );

  const signatureTool = core.getTool('AnnotationCreateSignature');
  const dispatch = useDispatch();

  const setSignatureIndex = index => {
    dispatch(actions.setSelectedSignatureIndex(index));
    // const { annotation } = savedSignatures[index];
    // core.setToolMode('AnnotationCreateSignature');
    // signatureTool.setSignature(annotation);

    // if (signatureTool.hasLocation()) {
    //   signatureTool.addSignature();
    // } else {
    //   signatureTool.showPreview();
    // }
  };

  const deleteSignature = index => {
    signatureTool.deleteSavedSignature(index);

    const isDeletingSelectedSignature = selectedSignatureIndex === index;
    if (isDeletingSelectedSignature) {
      if (savedSignatures.length > 1) {
        setSignatureIndex(0);
      } else {
        signatureTool.annot = null;
        signatureTool.hidePreview();
        dispatch(actions.setSelectedSignatureIndex(0));
        dispatch(actions.closeElements(['toolStylePopup']));
      }
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
            onClick={() => setSignatureIndex(i)}
            imgSrc={imgSrc}
            isActive={selectedSignatureIndex === i}
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