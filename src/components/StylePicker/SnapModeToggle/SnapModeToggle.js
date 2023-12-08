import React from 'react';
import { workerTypes } from 'constants/types';
import core from 'core';
import i18next from 'i18next';
import Choice from 'components/Choice/Choice';
import getMeasurementTools from 'helpers/getMeasurementTools';
import actions from 'actions';
import { useDispatch } from 'react-redux';

const SnapModeToggle = ({
  Scale,
  Precision,
  isSnapModeEnabled,
}) => {
  const dispatch = useDispatch();

  const wasDocumentSwappedToClientSide =
    core.getDocument()?.getType() === workerTypes.WEBVIEWER_SERVER && core.getDocument().isWebViewerServerDocument();
  const isEligibleDocumentForSnapping = core.getDocument()?.getType().toLowerCase() === workerTypes.PDF || wasDocumentSwappedToClientSide;
  const showMeasurementSnappingOption = Scale && Precision && isEligibleDocumentForSnapping && core.isFullPDFEnabled();

  const onSnappingChange = (event) => {
    if (!core.isFullPDFEnabled()) {
      return;
    }

    const enableSnapping = event.target.checked;
    const mode = enableSnapping
      ? core.getDocumentViewer().SnapMode.e_DefaultSnapMode | core.getDocumentViewer().SnapMode.POINT_ON_LINE
      : null;
    const measurementTools = getMeasurementTools();

    measurementTools.forEach((tool) => {
      tool.setSnapMode?.(mode);
    });

    dispatch(actions.setEnableSnapMode(enableSnapping));
  };

  return (
    <>
      {showMeasurementSnappingOption && (
        <div className="snapping-option">
          <Choice
            dataElement="measurementSnappingOption"
            id="measurement-snapping"
            type="checkbox"
            label={i18next.t('option.shared.enableSnapping')}
            checked={isSnapModeEnabled}
            onChange={onSnappingChange}
          />
        </div>
      )}
    </>
  );
};

export default SnapModeToggle;