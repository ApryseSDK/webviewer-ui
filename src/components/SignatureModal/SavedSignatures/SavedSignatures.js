import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './SavedSignatures.scss';
import SignatureModes from 'constants/signatureModes';
import defaultTool from 'constants/defaultTool';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import core from 'core';
import classNames from 'classnames';


const SavedSignatures = ({ selectedIndex, setSelectedIndex }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [
    displayedSignatures,
    selectedDisplayedSignatureIndex,
    isSignatureDeleteButtonDisabled,
    savedInitials,
    selectedDisplayedInitialsIndex,
    signatureMode,
    initialsOffset,
  ] = useSelector(
    (state) => [
      selectors.getDisplayedSignatures(state),
      selectors.getSelectedDisplayedSignatureIndex(state),
      selectors.isElementDisabled(state, 'defaultSignatureDeleteButton'),
      selectors.getSavedInitials(state),
      selectors.getSelectedDisplayedInitialsIndex(state),
      selectors.getSignatureMode(state),
      selectors.getInitialsOffset(state),
    ]
  );

  const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');

  const deleteSignatureAndInitials = async (index) => {
    const isFullSignature = signatureMode === SignatureModes.FULL_SIGNATURE;
    const initialsIndex = index - initialsOffset;
    const skipInitial = initialsIndex < 0;
    if (!skipInitial) {
      signatureToolArray[0].deleteSavedInitials(initialsIndex);
      const isDeletingSelectedInitials = selectedDisplayedInitialsIndex === initialsIndex && !skipInitial;
      if (isDeletingSelectedInitials) {
        dispatch(actions.setSelectedDisplayedInitialsIndex(0));
        for (const signatureTool of signatureToolArray) {
          signatureTool.hidePreview();
        }
        core.setToolMode(defaultTool);
      }
    } else {
      dispatch(actions.setInitialsOffset(initialsOffset - 1));
    }
    signatureToolArray[0].deleteSavedSignature(index);
    const isDeletingSelectedSignature = selectedDisplayedSignatureIndex === index;
    if (isDeletingSelectedSignature) {
      dispatch(actions.setSelectedDisplayedSignatureIndex(0));
      for (const signatureTool of signatureToolArray) {
        signatureTool.hidePreview();
      }
      core.setToolMode(defaultTool);
    } else if (isFullSignature ? index < selectedDisplayedSignatureIndex : initialsIndex < selectedDisplayedInitialsIndex) {
      dispatch(actions.setSelectedDisplayedSignatureIndex(selectedDisplayedSignatureIndex - 1));
    }
  };

  const displayedIntials = new Array(initialsOffset).concat(savedInitials);

  return (
    <div className={classNames('SavedSignatures', { empty: !displayedSignatures || displayedSignatures.length < 1 })}>
      {displayedSignatures.length ?
        displayedSignatures.map((signature, index) => <div
          key={index}
          className={classNames('signature-row', { active: selectedIndex === index, 'no-initials': !displayedIntials?.[index] })}
          onClick={() => setSelectedIndex(index)}
        >
          <div className="inputContainer">
            <input type='radio' onChange={() => setSelectedIndex(index)} checked={index === selectedIndex}/>
            <div className="contentContainer">
              <div className="imgContainer">
                <img alt={t('option.toolsOverlay.signatureAltText')} src={displayedSignatures[index].imgSrc}/>
              </div>
              {displayedIntials?.[index] && <div className="imgContainer">
                <img alt={t('option.toolsOverlay.signatureAltText')} src={displayedIntials[index].imgSrc}/>
              </div>}
              {!isSignatureDeleteButtonDisabled && (
                <button
                  className="icon"
                  data-element="defaultSignatureDeleteButton"
                  onClick={() => deleteSignatureAndInitials(index)}
                >
                  <Icon glyph="icon-delete-line" />
                </button>
              )}
            </div>
          </div>
          <div className="labelContainer">
            <div className="signatureLabel">{t('option.type.signature')}</div>
            {displayedIntials?.[index] && <div className="intialsLabel">{t('option.type.initials')}</div>}
          </div>
        </div>
        )
        :
        <div className='emptyListContainer'>
          {t('option.signatureModal.noSignatures')}
        </div>
      }
    </div>
  );
};

export default SavedSignatures;
