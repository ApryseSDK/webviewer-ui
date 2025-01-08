import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import selectors from 'selectors';
import CollapsibleSection from 'components/CollapsibleSection';
import { useSelector } from 'react-redux';
import { isMobileSize } from 'helpers/getDeviceSize';
import { PANEL_SIZES } from 'constants/panel';
import { isNull } from 'lodash';
import PropTypes from 'prop-types';

const RubberStamp = React.memo(({ imgSrc, annotation, index, onClick, isActive }) => {
  const [t] = useTranslation();
  const ariaLabel = `rubberStamp.${annotation.Icon}`;
  return (
    <button
      tabIndex={0}
      key={index}
      className={classNames('rubber-stamp', { 'active': isActive })}
      aria-label={t(ariaLabel)}
      onClick={() => onClick(annotation, index)}
      aria-current={isActive}
    >
      <img src={imgSrc} alt="" />
    </button>
  );
});

RubberStamp.displayName = 'RubberStamp';
RubberStamp.propTypes = {
  imgSrc: PropTypes.string,
  annotation: PropTypes.object,
  index: PropTypes.number,
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};

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
      t('rubberStampPanel.standard')
    );
  }, [t]);
  const ariaControls = 'rubber-stamps-list';

  return (
    <CollapsibleSection
      header={header}
      headingLevel={2}
      ariaControls={ariaControls}
      expansionDescription={t('rubberStampPanel.standard')}
    >
      <div className='rubber-stamps-list' id={ariaControls}>
        {rubberStamps}
      </div>
    </CollapsibleSection>
  );
};

StandardRubberStamps.displayName = 'StandardRubberStamps';
export default React.memo(StandardRubberStamps);