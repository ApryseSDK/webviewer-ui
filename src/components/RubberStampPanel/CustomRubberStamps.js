import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useCore from 'hooks/useCore';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import { isMobileSize } from 'src/helpers/getDeviceSize';
import { PANEL_SIZES } from 'src/constants/panel';
import isNull from 'lodash/isNull';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import CollapsibleSection from 'components/CollapsibleSection';
import { getCategoryLabel } from 'helpers/stamps';

const VirtualizedCustomStampList = React.lazy(() => import('./VirtualizedCustomStampList'));

const TOOL_NAME = 'AnnotationCreateRubberStamp';

const CustomRubberStamp = React.memo((
  {
    imgSrc,
    annotation,
    index,
    onClick,
    deleteHandler,
    standardStampsOffset,
    isActive,
  }) => {
  const [t] = useTranslation();
  const customStampData = annotation.getCustomData('trn-custom-stamp');
  let stampInfo;
  try {
    stampInfo = JSON.parse(customStampData);
  } catch (e) {
    stampInfo = { title: `${t('annotation.defaultCustomStampTitle')}` };
  }
  return (
    <div className='custom-rubber-stamp-row' tabIndex='-1'>
      <button
        key={index}
        className={classNames('rubber-stamp', { 'active': isActive })}
        aria-label={`${t('annotation.stamp')} ${stampInfo.title} ${stampInfo.author} ${annotation.DateCreated}`}
        onClick={() => onClick(annotation, index + standardStampsOffset)}
        aria-current={isActive}
      >
        <img src={imgSrc} alt="" />
      </button>
      <Button
        dataElement="customStampDeleteButton"
        onClick={() => {
          deleteHandler(index);
        }}
        img="icon-delete-line"
        ariaLabel={`${t('action.delete')} ${t('annotation.stamp')} ${index + 1}`}
      />
    </div>
  );
});

CustomRubberStamp.displayName = 'CustomRubberStamp';
CustomRubberStamp.propTypes = {
  imgSrc: PropTypes.string,
  annotation: PropTypes.object,
  index: PropTypes.number,
  onClick: PropTypes.func,
  deleteHandler: PropTypes.func,
  standardStampsOffset: PropTypes.number,
  isActive: PropTypes.bool,
};


const CustomRubberStamps = (
  {
    selectedStampIndex,
    setSelectedRubberStamp,
    standardStampsOffset,
    isFlyout,
    searchResults,
    scrollParent,
  }) => {
  const { core } = useCore();
  const stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);

  const isMobile = isMobileSize();
  const dispatch = useDispatch();

  const mobilePanelSize = useSelector(selectors.getMobilePanelSize);
  const lastSelectedStampIndex = useSelector(selectors.getLastSelectedStampIndex);
  const categories = Object.keys(searchResults || {});

  const getNextStampIndex = (deletedIndex, newSizeCustomStamps) => {
    if (newSizeCustomStamps === 0) {
      return null;
    }
    if (deletedIndex === 0) {
      return standardStampsOffset;
    }
    if (deletedIndex - 1 >= 0) {
      // If there is a stamp before the deleted stamp, select the stamp before the deleted stamp
      return deletedIndex - 1 + standardStampsOffset;
    }
    return deletedIndex + standardStampsOffset;
  };

  const deleteCustomStamp = useCallback((index) => {
    const isActiveStamp = selectedStampIndex === index + standardStampsOffset;
    let indexToShow;
    for (const tool of stampToolArray) {
      const stamps = tool.getCustomStamps();
      tool.deleteCustomStamps([stamps[index]]);
      if (tool === stampToolArray[0]) {
        indexToShow = getNextStampIndex(index, tool.getCustomStamps().length);
      }
      if (isActiveStamp) {
        tool.hidePreview();
        tool.setRubberStamp(null);
      }
    }
    if (stampToolArray.length > 0) {
      dispatch(actions.setSelectedStampIndex(null));
      dispatch(actions.setLastSelectedStampIndex(indexToShow));
    }
  }, [dispatch, stampToolArray, standardStampsOffset, selectedStampIndex]);

  const isMobileModeWithLargerSize = isMobile && mobilePanelSize !== PANEL_SIZES.SMALL_SIZE;
  const isMobileModeSmallSize = isMobile && mobilePanelSize === PANEL_SIZES.SMALL_SIZE;

  const visibleCustomStampsByCategory = useMemo(() => {
    const stampsByCategory = new Map();
    categories.forEach((category) => {
      const visibleStamps = (searchResults[category] || []).map(({ imgSrc, annotation, index }) => {
        const customStampIndex = index + standardStampsOffset;
        const isStampActive = selectedStampIndex === customStampIndex;

        const shouldShowOnlyFirstStamp = isMobileModeSmallSize && ((isNull(selectedStampIndex) && customStampIndex === lastSelectedStampIndex) || isStampActive);
        const shouldShowStamp = !isMobile || isMobileModeWithLargerSize || shouldShowOnlyFirstStamp || (isMobileModeSmallSize && isStampActive) || isFlyout;
        if (shouldShowStamp) {
          return {
            index,
            imgSrc,
            annotation,
            isStampActive,
          };
        }
        return null;
      }).filter(Boolean);
      stampsByCategory.set(category, visibleStamps);
    });
    return stampsByCategory;
  },
  [
    categories,
    searchResults,
    standardStampsOffset,
    selectedStampIndex,
    isMobileModeSmallSize,
    lastSelectedStampIndex,
    isMobile,
    isMobileModeWithLargerSize,
    isFlyout,
  ]);

  const renderCustomStamp = useCallback((_, stampData) => {
    if (!stampData) {
      return null;
    }
    const { index, imgSrc, annotation, isStampActive } = stampData;
    return (
      <CustomRubberStamp
        key={index}
        index={index}
        imgSrc={imgSrc}
        annotation={annotation}
        onClick={setSelectedRubberStamp}
        standardStampsOffset={standardStampsOffset}
        deleteHandler={deleteCustomStamp}
        isActive={isStampActive}
      />
    );
  }, [setSelectedRubberStamp, standardStampsOffset, deleteCustomStamp]);

  const testModeProps = process.env.NODE_ENV === 'test' ? { initialItemCount: 10 } : {};

  const isReady = process.env.NODE_ENV === 'test' || scrollParent !== null;

  if (categories.length === 0) {
    return null;
  }
  return categories.map((category, categoryIndex) => {
    const ariaControls = `rubber-stamps-list-custom-${categoryIndex}`;
    const categoryLabel = getCategoryLabel(category);
    const categoryStamps = visibleCustomStampsByCategory.get(category) || [];
    if (categoryStamps.length === 0) {
      return null;
    }
    return (
      <CollapsibleSection
        key={category}
        header={() => categoryLabel}
        headingLevel={2}
        ariaControls={ariaControls}
        expansionDescription={categoryLabel}
      >
        <div className='rubber-stamps-list custom-rubber-stamps-list' id={ariaControls}>
          {isReady && (
            <React.Suspense fallback={null}>
              <VirtualizedCustomStampList
                scrollParent={scrollParent}
                visibleCustomStamps={categoryStamps}
                renderCustomStamp={renderCustomStamp}
                testModeProps={testModeProps}
              />
            </React.Suspense>
          )}
        </div>
      </CollapsibleSection>
    );
  });
};

CustomRubberStamps.displayName = 'CustomRubberStamps';
CustomRubberStamps.propTypes = {
  selectedStampIndex: PropTypes.number,
  setSelectedRubberStamp: PropTypes.func,
  standardStampsOffset: PropTypes.number,
  isFlyout: PropTypes.bool,
  scrollParent: PropTypes.object,
};
export default React.memo(CustomRubberStamps);