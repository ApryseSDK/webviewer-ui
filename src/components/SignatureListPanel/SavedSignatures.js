import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import SignatureModes from 'constants/signatureModes';
import { isMobileSize } from 'helpers/getDeviceSize';
import { PANEL_SIZES } from 'constants/panel';
import PropTypes from 'prop-types';
import Button from 'components/Button';

const VirtualizedSignatureList = React.lazy(() => import('./VirtualizedSignatureList'));

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

  const visibleSignatures = React.useMemo(() => savedSignatures
    // Need to keep the index information from the original signature list
    .map((signatureObject, index) => [signatureObject, index])
    .filter((_, savedSignatureIndex) => {
      const isPanelSizeLarge = !panelSize || panelSize !== PANEL_SIZES.SMALL_SIZE;
      const isMobileSizeWithSmallPanel = isMobile && panelSize === PANEL_SIZES.SMALL_SIZE;
      return isPanelSizeLarge || (isMobileSizeWithSmallPanel && currentlySelectedSignature === savedSignatureIndex);
    }),
  [savedSignatures, panelSize, isMobile, currentlySelectedSignature]);

  const renderSignatureRow = React.useCallback((_, signatureData) => {
    if (!signatureData) {
      return null;
    }
    const [{ fullSignature, initials }, savedSignatureIndex] = signatureData;
    return (
      <div
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
          <Button
            className="icon-button"
            img="icon-delete-line"
            ariaLabel={t('action.delete')}
            dataElement="defaultSignatureDeleteButton"
            onMouseOver={() => setHoveredIndexToDelete(savedSignatureIndex)}
            onMouseLeave={() => setHoveredIndexToDelete(null)}
            onClick={() => {
              deleteHandler(savedSignatureIndex);
              setHoveredIndexToDelete(null);
            }}
          />
        )}
      </div>
    );
  }, [onFullSignatureSetHandler, onInitialsSetHandler, currentlySelectedSignature, hoveredIndexToDelete, signatureMode, isDeleteDisabled, t, deleteHandler]);

  const testModeProps = process.env.NODE_ENV === 'test' ? { initialItemCount: 10 } : {};

  if (savedSignatures.length > 0) {
    return (<div className='signature-list'>
      {renderSignatureListHeader()}
      <div className='saved-signatures-virtuoso-container'>
        <React.Suspense fallback={null}>
          <VirtualizedSignatureList
            visibleSignatures={visibleSignatures}
            renderSignatureRow={renderSignatureRow}
            testModeProps={testModeProps}
          />
        </React.Suspense>
      </div>
    </div>);
  }
  return null;
};

SavedSignatures.displayName = 'SavedSignatures';
SavedSignatures.propTypes = {
  panelSize: PropTypes.oneOf(Object.values(PANEL_SIZES)),
};

export default React.memo(SavedSignatures);