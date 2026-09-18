import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import selectors from 'selectors';
import CollapsibleSection from 'components/CollapsibleSection';
import { useSelector } from 'react-redux';
import { isMobileSize } from 'helpers/getDeviceSize';
import { PANEL_SIZES } from 'constants/panel';
import isNull from 'lodash/isNull';
import PropTypes from 'prop-types';
import { getCategoryLabel } from 'helpers/stamps';
import LoadingScreenStyles from 'constants/loadingScreenStyles';
import Spinner from 'components/Spinner';

const VirtualizedStampList = React.lazy(() => import('./VirtualizedStampList'));

const STAMPS_PER_ROW = 2;

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

const StandardRubberStamps = (
  {
    selectedStampIndex,
    setSelectedRubberStamp,
    isFlyout,
    scrollParent,
    searchResults,
    isDocumentStampsLoading,
  }) => {
  const isMobile = isMobileSize();
  const mobilePanelSize = useSelector(selectors.getMobilePanelSize);
  const lastSelectedStampIndex = useSelector(selectors.getLastSelectedStampIndex);
  const categories = Object.keys(searchResults || {});
  const stampsPerRow = STAMPS_PER_ROW;
  const loadingScreenStyle = useSelector(selectors.getLoadingScreenStyle);

  const stampRowsByCategory = useMemo(() => {
    const rowsByCategory = new Map();
    categories.forEach((category) => {
      const categoryStamps = (searchResults[category] || []).map(({ imgSrc, annotation, index }) => {
        const isStampActive = selectedStampIndex === index;
        const lastStampToShow = lastSelectedStampIndex || 0;
        const shouldShowOnlyFirstStamp = index === lastStampToShow && isNull(selectedStampIndex);

        const shouldRenderStamp = (!isMobile || (isMobile && mobilePanelSize !== PANEL_SIZES.SMALL_SIZE)) ||
          (isMobile && mobilePanelSize === PANEL_SIZES.SMALL_SIZE && (isStampActive || shouldShowOnlyFirstStamp)) || isFlyout;

        if (!shouldRenderStamp) {
          return null;
        }

        return {
          index,
          imgSrc,
          annotation,
          isStampActive,
        };
      }).filter(Boolean);
      const rows = [];
      for (let index = 0; index < categoryStamps.length; index += stampsPerRow) {
        rows.push(categoryStamps.slice(index, index + stampsPerRow));
      }
      rowsByCategory.set(category, rows);
    });
    return rowsByCategory;
  }, [categories, searchResults, selectedStampIndex, lastSelectedStampIndex, isMobile, mobilePanelSize, isFlyout, stampsPerRow]);

  const renderStampRow = useCallback((_, row) => {
    const rowItems = row || [];
    return (
      <div className={classNames('rubber-stamp-virtual-row', 'standard-rubber-stamps-list')}>
        {rowItems.map(({ index, imgSrc, annotation, isStampActive }) => (
          <RubberStamp
            key={index}
            index={index}
            imgSrc={imgSrc}
            annotation={annotation}
            onClick={setSelectedRubberStamp}
            isActive={isStampActive}
          />
        ))}
      </div>
    );
  }, [setSelectedRubberStamp]);

  const testModeProps = process.env.NODE_ENV === 'test' ? { initialItemCount: 10 } : {};

  if (categories.length === 0) {
    return null;
  }

  let documentStampsLoadingIndicator = null;
  if (isDocumentStampsLoading) {
    documentStampsLoadingIndicator = loadingScreenStyle === LoadingScreenStyles.LEGACY
      ? <div className='document-stamps-loading document-stamps-loading-legacy' data-testid='document-stamps-loading'><Spinner inPanel width='40px' height='40px' /></div>
      : <div className='document-stamps-loading' data-testid='document-stamps-loading' aria-hidden='true'>
        <div className='document-stamp-skeleton' />
        <div className='document-stamp-skeleton' />
      </div>;
  }

  return (<>
    {categories.map((category, categoryIndex) => {
      const sectionAriaControls = `rubber-stamps-list-${categoryIndex}`;
      const categoryLabel = getCategoryLabel(category);
      const categoryStampRows = stampRowsByCategory.get(category) || [];
      if (categoryStampRows.length === 0) {
        return null;
      }
      return (
        <CollapsibleSection
          key={category}
          header={() => categoryLabel}
          headingLevel={2}
          ariaControls={sectionAriaControls}
          expansionDescription={categoryLabel}
        >
          <React.Suspense fallback={null}>
            <VirtualizedStampList
              rowData={categoryStampRows}
              renderStampRow={renderStampRow}
              testModeProps={testModeProps}
              ariaControls={sectionAriaControls}
              scrollParent={scrollParent}
            />
          </React.Suspense>
        </CollapsibleSection>
      );
    })}
    {documentStampsLoadingIndicator}
  </>
  );
};

StandardRubberStamps.displayName = 'StandardRubberStamps';
StandardRubberStamps.propTypes = {
  selectedStampIndex: PropTypes.number,
  setSelectedRubberStamp: PropTypes.func,
  isFlyout: PropTypes.bool,
  scrollParent: PropTypes.object,
  searchResults: PropTypes.object,
  isDocumentStampsLoading: PropTypes.bool,
};
export default React.memo(StandardRubberStamps);
