import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import CollapsiblePanelGroup from 'components/CollapsiblePanelGroup';

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
  const rubberStamps = standardStamps.map(({ imgSrc, annotation }, index) => {
    return (
      <RubberStamp
        key={index}
        index={index}
        imgSrc={imgSrc}
        annotation={annotation}
        onClick={setSelectedRubberStamp}
        isActive={selectedStampIndex === index}
      />
    );
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