import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import classNames from 'classnames';
import selectors from 'selectors';
import actions from 'actions';
import Icon from 'components/Icon';
import { useDispatch, useSelector } from 'react-redux';
import { isMobileSize } from 'src/helpers/getDeviceSize';
import { PANEL_SIZES } from 'src/constants/panel';
import { isNull } from 'lodash';
import PropTypes from 'prop-types';

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

  return (
    <div className='custom-rubber-stamp-row' tabIndex='0'>
      <button
        key={index}
        className={classNames('rubber-stamp', { 'active': isActive })}
        aria-label={`${t('annotation.stamp')} ${index + 1}`}
        onClick={() => onClick(annotation, index + standardStampsOffset)}
      >
        <img src={imgSrc} alt="" />
      </button>
      <button
        className="icon-button"
        data-element="defaultSignatureDeleteButton"
        onClick={() => {
          deleteHandler(index);
        }}
      >
        <Icon glyph="icon-delete-line" />
      </button>
    </div>
  );
});

CustomRubberStamp.displayName = 'CustomRubberStamp';


const CustomRubberStamps = (
  {
    customStamps,
    selectedStampIndex,
    setSelectedRubberStamp,
    standardStampsOffset,
  }) => {
  const stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);

  const isMobile = isMobileSize();
  const dispatch = useDispatch();

  const [
    mobilePanelSize,
    lastSelectedStampIndex,
  ] = useSelector(
    (state) => [
      selectors.getMobilePanelSize(state),
      selectors.getLastSelectedStampIndex(state),
    ],
  );

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
    for (const tool of stampToolArray) {
      const stamps = tool.getCustomStamps();
      tool.deleteCustomStamps([stamps[index]]);
      const indexToShow = getNextStampIndex(index, tool.getCustomStamps().length);
      dispatch(actions.setSelectedStampIndex(null));
      dispatch(actions.setLastSelectedStampIndex(indexToShow));
    }
  }, []);

  const isMobileModeWithLargerSize = isMobile && mobilePanelSize !== PANEL_SIZES.SMALL_SIZE;
  const isMobileModeSmallSize = isMobile && mobilePanelSize === PANEL_SIZES.SMALL_SIZE;

  const rubberStamps = customStamps.map(({ imgSrc, annotation }, index) => {
    const customStampIndex = index + standardStampsOffset;
    const isStampActive = selectedStampIndex === customStampIndex;

    const shouldShowOnlyFirstStamp = isMobileModeSmallSize && ((isNull(selectedStampIndex) && customStamps.length && customStampIndex === lastSelectedStampIndex) || isStampActive);
    if (!isMobile || isMobileModeWithLargerSize || shouldShowOnlyFirstStamp || (isMobileModeSmallSize && isStampActive)) {
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
    }
    return null;
  });

  if (customStamps.length === 0) {
    return null;
  }

  return (
    <div className='rubber-stamps-list'>
      {rubberStamps}
    </div>
  );
};

CustomRubberStamps.displayName = 'CustomRubberStamps';
CustomRubberStamps.propTypes = {
  customStamps: PropTypes.array,
  selectedStampIndex: PropTypes.number,
  setSelectedRubberStamp: PropTypes.func,
  standardStampsOffset: PropTypes.number,
};
export default React.memo(CustomRubberStamps);