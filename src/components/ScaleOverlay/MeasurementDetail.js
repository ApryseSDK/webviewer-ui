import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { mapAnnotationToKey, mapToolNameToKey, getDataWithKey } from 'constants/map';
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
};

const MeasurementDetail = ({ annotation, isOpen, selectedTool }) => {
  const { t } = useTranslation();

  const data = useMemo(() => {
    const key = annotation ? mapAnnotationToKey(annotation) : mapToolNameToKey(selectedTool.name);
    return {
      key,
      icon: getDataWithKey(key).icon,
      color: annotation ? annotation.Color.toHexString() : selectedTool?.defaults?.StrokeColor?.toHexString(),
      contents: annotation ? annotation.getContents() : 0,
      precision: !annotation ? selectedTool?.defaults?.Precision : annotation.Precision,
    };
  });

  const renderTitle = () => {
    const { key, icon, color } = data;
    const keyTitleMap = {
      distanceMeasurement: t('option.measurementOverlay.distanceMeasurement'),
      perimeterMeasurement: t('option.measurementOverlay.perimeterMeasurement'),
      areaMeasurement: t('option.measurementOverlay.areaMeasurement'),
      rectangularAreaMeasurement: t('option.measurementOverlay.areaMeasurement'),
      cloudyRectangularAreaMeasurement: t('option.measurementOverlay.areaMeasurement'),
      ellipseMeasurement: t('option.measurementOverlay.areaMeasurement'),
      arcMeasurement: t('option.measurementOverlay.arcMeasurement'),
    };

    return (
      <div className="header">
        <Icon glyph={icon} color={color} className="icon" />
        <div>{keyTitleMap[key]}</div>
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
        {contents}
      </div>
    );
  };

  const renderAngle = () => {
    if (!annotation) {
      return (
        <div className="measurement__detail-item">
          <div className="measurement_list">{t('option.measurementOverlay.angle')}:</div> 0&deg;
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
          {angle}&deg;
        </div>
      )
    );
  };

  const renderLength = () => {
    const length = annotation?.Length || 0;
    return (
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.measurementOverlay.length')}</div> {length}
      </div>
    );
  };

  const renderRadius = () => {
    const radius = annotation?.Radius || 0;
    return (
      <div className="measurement__detail-item">
        <div className="measurement_list">{t('option.measurementOverlay.radius')}</div> {radius}
      </div>
    );
  };

  const renderDetails = () => {
    const { key, precision } = data;
    if (key === 'ellipseMeasurement') {
      return <EllipseMeasurementOverlay annotation={annotation} selectedTool={selectedTool} isOpen={isOpen} />;
    }

    return (
      <div className="measurement__detail-container">
        <div className="measurement__detail-item">
          <div className="measurement_list">{t('option.shared.precision')}:</div>
          {precisionFractions[precision] || precision}
        </div>
        {key === 'distanceMeasurement' && (
          <LineMeasurementInput annotation={annotation} isOpen={isOpen} selectedTool={selectedTool} />
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
