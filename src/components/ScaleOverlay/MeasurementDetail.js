import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { mapAnnotationToKey, mapToolNameToKey, getDataWithKey } from 'constants/map';
import { measurementTypeTranslationMap } from 'constants/measurementTypes';
import { precisionFractions } from 'constants/measurementScale';
import getNumberOfDecimalPlaces from 'helpers/getNumberOfDecimalPlaces';
import Icon from 'components/Icon';
import LineMeasurementInput from 'components/MeasurementOverlay/LineMeasurementInput';
import EllipseMeasurementOverlay from 'components/MeasurementOverlay/EllipseMeasurementOverlay';
import getAngleInRadians from 'helpers/getAngleInRadians';

import './ScaleOverlay.scss';

const propTypes = {
  annotation: PropTypes.object,
  isOpen: PropTypes.bool.isRequired,
  selectedTool: PropTypes.object,
  canModify: PropTypes.bool,
};

const MeasurementDetail = ({ annotation, isOpen, selectedTool, canModify }) => {
  const { t } = useTranslation();

  const data = useMemo(() => {
    const key = annotation ? mapAnnotationToKey(annotation) : mapToolNameToKey(selectedTool.name);

    return {
      key,
      icon: getDataWithKey(key).icon,
      color: annotation ? annotation.Color.toHexString() : selectedTool?.defaults?.StrokeColor?.toHexString(),
      contents: annotation ? annotation.getMeasurementTextWithScaleAndUnits?.() : 0,
      precision: !annotation ? selectedTool?.defaults?.Precision : annotation.Precision,
    };
  });

  const renderTitle = () => {
    const { key, icon, color } = data;
    const translationKey = measurementTypeTranslationMap[key];

    return (
      <div className="header">
        <Icon glyph={icon} color={color} className="icon" />
        <div>{t(translationKey)}</div>
      </div>
    );
  };

  const renderValue = () => {
    const { key, contents } = data;

    const keyDisplayNameMap = {
      distanceMeasurement: t('option.measurementOverlay.distance'),
      perimeterMeasurement: t('option.measurementOverlay.perimeter'),
      areaMeasurement: t('option.measurementOverlay.area'),
      rectangularAreaMeasurement: t('option.measurementOverlay.area'),
      cloudyRectangularAreaMeasurement: t('option.measurementOverlay.area'),
    };

    return (
      <div className="measurement__detail-item">
        <div className="measurement_list">{keyDisplayNameMap[key]}:</div>
        <div className="measurement">
          {contents}
        </div>
      </div>
    );
  };

  const renderAngle = () => {
    if (!annotation) {
      return (
        <div className="measurement__detail-item">
          <div className="measurement_list">{t('option.measurementOverlay.angle')}:</div>
          <div className="measurement">
            0&deg;
          </div>
        </div>
      );
    }
    const { key } = data;
    const getIPathAnnotationPts = (annotation) => {
      const path = annotation.getPath();
      const length = path.length;
      return [path[length - 3], path[length - 2], path[length - 1]];
    };
    const keyPtMap = {
      distanceMeasurement: ({ Start, End }) => [Start, End],
      perimeterMeasurement: getIPathAnnotationPts,
      areaMeasurement: getIPathAnnotationPts,
      rectangularAreaMeasurement: getIPathAnnotationPts,
      cloudyRectangularAreaMeasurement: getIPathAnnotationPts,
      arcMeasurement: getIPathAnnotationPts,
    };
    const pts = keyPtMap[key](annotation).filter((pt) => !!pt);

    let angle = getAngleInRadians(...pts);
    if (angle) {
      const decimalPlaces = getNumberOfDecimalPlaces(annotation.Precision);
      angle = ((angle / Math.PI) * 180).toFixed(decimalPlaces);
    }

    if (key === 'arcMeasurement') {
      angle = annotation.Angle.toFixed(2);
    }

    return (
      angle !== undefined && (
        <div className="measurement__detail-item">
          <div className="measurement_list">{t('option.measurementOverlay.angle')}:</div>
          <div className="measurement">
            {angle}&deg;
          </div>
        </div>
      )
    );
  };

  const renderLength = () => {
    const length = annotation?.Length || 0;
    return (
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.measurementOverlay.length')}</div>
        <div className="measurement">
          {length}
        </div>
      </div>
    );
  };

  const renderRadius = () => {
    const radius = annotation?.Radius || 0;
    return (
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.measurementOverlay.radius')}</div>
        <div className="measurement">
          {radius}
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    const { key, precision } = data;
    if (key === 'ellipseMeasurement') {
      return <EllipseMeasurementOverlay annotation={annotation} selectedTool={selectedTool} isOpen={isOpen} canModify={canModify} />;
    }

    return (
      <div className="measurement__detail-container">
        <div className="measurement__detail-item">
          <div className="measurement_list">{t('option.shared.precision')}:</div>
          <div className="measurement">
            {precisionFractions[precision] || precision}
          </div>
        </div>
        {key === 'distanceMeasurement' && (
          <LineMeasurementInput annotation={annotation} isOpen={isOpen} selectedTool={selectedTool} canModify={canModify} />
        )}
        {[
          'rectangularAreaMeasurement',
          'cloudyRectangularAreaMeasurement',
          'perimeterMeasurement',
          'areaMeasurement',
        ].includes(key) && renderValue()}
        {key === 'arcMeasurement' && renderLength()}
        {key === 'arcMeasurement' && renderRadius()}
        {!['rectangularAreaMeasurement', 'distanceMeasurement', 'cloudyRectangularAreaMeasurement'].includes(key) &&
          renderAngle()}
      </div>
    );
  };

  return (
    <div className="MeasurementDetail">
      {renderTitle()}
      {renderDetails()}
    </div>
  );
};

MeasurementDetail.propTypes = propTypes;

export default MeasurementDetail;
