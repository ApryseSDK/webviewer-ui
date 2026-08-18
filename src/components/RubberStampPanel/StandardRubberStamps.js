import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import selectors from 'selectors';
import CollapsibleSection from 'components/CollapsibleSection';
import { useSelector, shallowEqual } from 'react-redux';
import { isMobileSize } from 'helpers/getDeviceSize';
import { PANEL_SIZES } from 'constants/panel';
import isNull from 'lodash/isNull';
import PropTypes from 'prop-types';
// TODO: Remove this enum and utilize real categories once categories are added
const STANDARD_STAMP_CATEGORY = {
  CATEGORY_1: 'Category 1',
  LEGAL: 'Legal',
  VERSATILE: 'Versatile',
};

const RubberStamp = React.memo(({ imgSrc, annotation, index, onClick, isActive }) => {
  const [t] = useTranslation();
  const icon = annotation?.Icon || '';
  const translationKey = `rubberStamp.${icon}`;
  const translatedLabel = t(translationKey);
  const fallbackLabel = icon || t('annotation.stamp');
  const ariaLabel = translatedLabel === translationKey ? fallbackLabel : translatedLabel;
  return (
    <button
      tabIndex={0}
      key={index}
      className={classNames('rubber-stamp', { 'active': isActive })}
      aria-label={ariaLabel}
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

const StandardRubberStamps = ({ standardStamps, selectedStampIndex, setSelectedRubberStamp, isFlyout }) => {
  const [t] = useTranslation();
  const isMobile = isMobileSize();
  const mobilePanelSize = useSelector(selectors.getMobilePanelSize);
  const lastSelectedStampIndex = useSelector(selectors.getLastSelectedStampIndex);
  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);

  const rubberStamps = standardStamps.map(({ imgSrc, annotation }, index) => {
    const isStampActive = selectedStampIndex === index;
    const lastStampToShow = lastSelectedStampIndex || 0;
    const shouldShowOnlyFirstStamp = index === lastStampToShow && isNull(selectedStampIndex);

    const shouldRenderStamp = (!isMobile || (isMobile && mobilePanelSize !== PANEL_SIZES.SMALL_SIZE)) ||
      (isMobile && mobilePanelSize === PANEL_SIZES.SMALL_SIZE && (isStampActive || shouldShowOnlyFirstStamp)) || isFlyout;

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

  const sections = Object.values(STANDARD_STAMP_CATEGORY)
    .map((category) => ({
      key: category,
      header: category,
      expansionDescription: category,
    }));

  return (featureFlags.newStampPanel ?
    (<>
      {sections.map(({ key, header, expansionDescription }) => {
        const ariaControls = `rubber-stamps-list-${key}`;

        return (
          <CollapsibleSection
            key={key}
            header={() => header}
            headingLevel={2}
            ariaControls={ariaControls}
            expansionDescription={expansionDescription}
          >
            <div className='rubber-stamps-list standard-rubber-stamps-list' id={ariaControls}>
              {rubberStamps}
            </div>
          </CollapsibleSection>
        );
      })}
    </>
    ) :
    (<CollapsibleSection
      header={header}
      headingLevel={2}
      ariaControls={ariaControls}
      expansionDescription={t('rubberStampPanel.standard')}
    >
      <div className='rubber-stamps-list' id={ariaControls}>
        {rubberStamps}
      </div>
    </CollapsibleSection>));
};

StandardRubberStamps.displayName = 'StandardRubberStamps';
export default React.memo(StandardRubberStamps);