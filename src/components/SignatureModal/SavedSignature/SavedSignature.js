import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Choice, IconButton } from '@pdftron/webviewer-react-toolkit';

import core from 'core';

import './SavedSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  isTabPanelSelected: PropTypes.bool,
  createSignature: PropTypes.func.isRequired,
  savedSignatures: PropTypes.arrayOf(PropTypes.string),
  deleteSavedSignature: PropTypes.func,
  showDeleteSavedSignature: PropTypes.bool,
};

const Signature = ({ signature, deleteSavedSignature, showDelete = false }) => {
  return (
    <div className="saved-signature-image-container">
      <img className="saved-signature-image" src={signature} alt="signature" />
      {showDelete && (
        <div className="saved-signature-icon-button">
          <IconButton onClick={deleteSavedSignature}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.6 3.3999H2.8H12.4"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.6 3.4V2.2C4.6 1.88174 4.72643 1.57652 4.95147 1.35147C5.17652 1.12643 5.48174 1 5.8 1H8.2C8.51826 1 8.82348 1.12643 9.04853 1.35147C9.27357 1.57652 9.4 1.88174 9.4 2.2V3.4M11.2 3.4V11.8C11.2 12.1183 11.0736 12.4235 10.8485 12.6485C10.6235 12.8736 10.3183 13 10 13H4C3.68174 13 3.37651 12.8736 3.15147 12.6485C2.92643 12.4235 2.8 12.1183 2.8 11.8V3.4H11.2Z"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.8 6.3999V9.9999"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.2 6.3999V9.9999"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </IconButton>
        </div>
      )}
    </div>
  );
};

Signature.propTypes = {
  signature: PropTypes.string,
  deleteSavedSignature: PropTypes.func,
  showDelete: PropTypes.bool,
};

const SavedSignature = ({
  isModalOpen,
  isTabPanelSelected,
  createSignature,
  deleteSavedSignature,
  showDeleteSavedSignature = false,
}) => {
  const [selectedSignatureIndex, setSelectedSignatureIndex] = useState(0);
  const [savedSignatures, setSavedSignatures] = useState(window.parent?.savedSignatures ?? []);
  const [t] = useTranslation();

  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');

    if (isModalOpen && isTabPanelSelected && savedSignatures.length > 0) {
      var stringLength = savedSignatures[selectedSignatureIndex].length - 'data:image/png;base64,'.length;

      var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
      signatureTool.setSignature(savedSignatures[selectedSignatureIndex], sizeInBytes);
    }
  }, [savedSignatures, selectedSignatureIndex, isTabPanelSelected, isModalOpen]);

  useEffect(() => {
    const listener = () => {
      setSavedSignatures(window.parent?.savedSignatures ?? []);
    };

    window.parent.addEventListener('savedSignaturesChanged', listener);

    return () => {
      window.parent.removeEventListener('savedSignaturesChanged', listener);
    };
  }, []);

  return (
    <React.Fragment>
      <div className="image-signature-image-container">
        {savedSignatures.length === 0 ? (
          <div className="saved-signature-container">You do not have any saved signatures.</div>
        ) : (
          <div className="saved-signature-container">
            {savedSignatures.map((savedSignature, index) => {
              const deleteSignature = () => {
                if (deleteSavedSignature) {
                  deleteSavedSignature(savedSignature);
                }
              };
              return (
                <div className="saved-signature-choice" key={`${savedSignature}${index}`}>
                  <Choice
                    label={
                      <Signature
                        signature={savedSignature}
                        deleteSavedSignature={deleteSignature}
                        showDelete={showDeleteSavedSignature}
                      />
                    }
                    onClick={() => {
                      setSelectedSignatureIndex(index);
                    }}
                    checked={selectedSignatureIndex === index}
                    radio
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="footer">
        <button
          className="signature-create"
          onClick={createSignature}
          disabled={
            !(isModalOpen && isTabPanelSelected) ||
            !(savedSignatures.length !== 0 && selectedSignatureIndex < savedSignatures.length)
          }
        >
          {t('action.create')}
        </button>
      </div>
    </React.Fragment>
  );
};

SavedSignature.propTypes = propTypes;

export default SavedSignature;
