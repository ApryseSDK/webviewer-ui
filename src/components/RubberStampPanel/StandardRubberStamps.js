import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import selectors from 'selectors';
import CollapsiblePanelGroup from 'components/CollapsiblePanelGroup';
import { useSelector } from 'react-redux';
import { isMobileSize } from 'helpers/getDeviceSize';
import { PANEL_SIZES } from 'constants/panel';
import { isNull } from 'lodash';

const RubberStamp = React.memo(({ imgSrc, annotation, index, onClick, isActive }) => {
  const [t] = useTranslation();

  return (
    <button
      tabIndex={0}
      key={index}
      className={classNames('rubber-stamp', { 'active': isActive })}
      aria-label={`${t('annotation.stamp')} ${index + 1}`}
      onClick={() => onClick(annotation, index)}
    >
      <img src={imgSrc} alt="" />
    </button>
  );
});

RubberStamp.displayName = 'RubberStamp';

const StandardRubberStamps = ({ standardStamps, selectedStampIndex, setSelectedRubberStamp }) => {
  const [t] = useTranslation();
  const isMobile = isMobileSize();

  const [
    mobilePanelSize,
    lastSelectedStampIndex,
  ] = useSelector(
    (state) => [
      selectors.getMobilePanelSize(state),
      selectors.getLastSelectedStampIndex(state),
    ]
  );

  const rubberStamps = standardStamps.map(({ imgSrc, annotation }, index) => {
    const isStampActive = selectedStampIndex === index;
    const lastStampToShow = lastSelectedStampIndex || 0;
    const shouldShowOnlyFirstStamp = index === lastStampToShow && isNull(selectedStampIndex);

    const shouldRenderStamp = (!isMobile || (isMobile && mobilePanelSize !== PANEL_SIZES.SMALL_SIZE)) ||
      (isMobile && mobilePanelSize === PANEL_SIZES.SMALL_SIZE && (isStampActive || shouldShowOnlyFirstStamp));

    return shouldRenderStamp ? (
      <RubberStamp
        key={index}
        index={index}
        imgSrc={imgSrc}
        annotation={annotation}
        onClick={setSelectedRubberStamp}
        isActive={isStampActive}
      />
    ) : null;
  });

  const header = useCallback(() => {
    return (
      <div className='rubber-stamps-list-header'>
        {t('rubberStampPanel.standard')}
      </div>
    );
  }, [t]);

  return (
    <CollapsiblePanelGroup
      header={header}>
      <div className='rubber-stamps-list'>
        {rubberStamps}
      </div>
    </CollapsiblePanelGroup>
  );
};

StandardRubberStamps.displayName = 'StandardRubberStamps';
export default React.memo(StandardRubberStamps);