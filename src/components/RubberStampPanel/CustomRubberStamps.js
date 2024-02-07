import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import classNames from 'classnames';
import Icon from 'components/Icon';

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

  const deleteCustomStamp = useCallback((index) => {
    for (const tool of stampToolArray) {
      const stamps = tool.getCustomStamps();
      tool.deleteCustomStamps([stamps[index]]);
    }
  }, []);

  const rubberStamps = customStamps.map(({ imgSrc, annotation }, index) => {
    return (
      <CustomRubberStamp
        key={index}
        index={index}
        imgSrc={imgSrc}
        annotation={annotation}
        onClick={setSelectedRubberStamp}
        standardStampsOffset={standardStampsOffset}
        deleteHandler={deleteCustomStamp}
        isActive={selectedStampIndex === (index + standardStampsOffset)}
      />
    );
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
export default React.memo(CustomRubberStamps);