import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'components/Icon';
import classNames from 'classnames';
import SignatureModes from 'constants/signatureModes';
import { isMobileSize } from 'helpers/getDeviceSize';
import { PANEL_SIZES } from 'constants/panel';
import PropTypes from 'prop-types';

const SignatureRowContent = React.memo(({
  index,
  onFullSignatureSetHandler,
  onInitialsSetHandler,
  isActive,
  altText,
  fullSignature,
  initials,
  isHoveredForDeletion,
  signatureMode,
}) => {
  const creatSignatureButton = (handler, imgSrc, signatureType) => (
    <button
      className={classNames('signature-row-content', {
        'interactable': handler,
        'active': isActive && signatureType === signatureMode,
        'removal-hovered': isHoveredForDeletion,
      }, `${signatureType === SignatureModes.FULL_SIGNATURE ? 'full-signature' : 'initials'}`)}
      onClick={() => handler(index)}
    >
      <img alt={altText} src={imgSrc} />
    </button>
  );

  return (
    <div className='signature-row-container'>
      {creatSignatureButton(onFullSignatureSetHandler, fullSignature?.imgSrc, SignatureModes.FULL_SIGNATURE)}
      {initials && creatSignatureButton(onInitialsSetHandler, initials.imgSrc, SignatureModes.INITIALS)}
    </div>
  );
});

SignatureRowContent.displayName = 'SignatureRowContent';


const SavedSignatures = (props) => {
  const {
    savedSignatures,
    onFullSignatureSetHandler,
    onInitialsSetHandler,
    deleteHandler,
    currentlySelectedSignature,
    isDeleteDisabled,
    signatureMode,
    panelSize,
  } = props;

  const { t } = useTranslation();
  const [hoveredIndexToDelete, setHoveredIndexToDelete] = React.useState(null);

  const renderSignatureListHeader = () => {
    const renderInitialsHeader = savedSignatures.some(({ initials }) => initials);
    return (
      <div className='signature-list-header'>
        <div className='signature-title'>{t('signatureListPanel.signatureList.signature')}</div>
        {renderInitialsHeader && <div className='initials-title'>{t('signatureListPanel.signatureList.initials')}</div>}
        <div className='delete-spacer'></div>
      </div>
    );
  };

  const isMobile = isMobileSize();

  if (savedSignatures.length > 0) {
    return (<div className='signature-list'>
      {renderSignatureListHeader()}
      {
        savedSignatures
          // Need to keep the index information from the original signature list
          .map((signatureObject, index) => [signatureObject, index])
          .map(([{ fullSignature, initials }, savedSignatureIndex]) => {
            const isPanelSizeLarge = !panelSize || panelSize !== PANEL_SIZES.SMALL_SIZE;
            const isMobileSizeWithSmallPanel = isMobile && panelSize === PANEL_SIZES.SMALL_SIZE;
            if (isPanelSizeLarge || (isMobileSizeWithSmallPanel && currentlySelectedSignature === savedSignatureIndex)) {
              return (<div
                key={savedSignatureIndex}
                className="signature-row"
              >
                <SignatureRowContent
                  index={savedSignatureIndex}
                  fullSignature={fullSignature}
                  initials={initials}
                  onFullSignatureSetHandler={onFullSignatureSetHandler}
                  onInitialsSetHandler={onInitialsSetHandler}
                  isActive={currentlySelectedSignature === savedSignatureIndex}
                  altText={`${t('option.toolsOverlay.signatureAltText')} ${savedSignatureIndex + 1}`}
                  isHoveredForDeletion={hoveredIndexToDelete === savedSignatureIndex}
                  signatureMode={signatureMode}
                />
                {!isDeleteDisabled && (
                  <button
                    className="icon-button"
                    data-element="defaultSignatureDeleteButton"
                    onMouseOver={() => setHoveredIndexToDelete(savedSignatureIndex)}
                    onMouseLeave={() => setHoveredIndexToDelete(null)}
                    onClick={() => {
                      deleteHandler(savedSignatureIndex);
                      setHoveredIndexToDelete(null);
                    }}
                  >
                    <Icon glyph="icon-delete-line" />
                  </button>
                )}
              </div>);
            }
            return null;
          })
      }
    </div>);
  }
  return null;
};

SavedSignatures.displayName = 'SavedSignatures';
SavedSignatures.propTypes = {
  panelSize: PropTypes.oneOf(Object.values(PANEL_SIZES)),
};

export default React.memo(SavedSignatures);