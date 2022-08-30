const Scale = window.Core.Scale;

export const PresetMeasurementSystems = {
  METRIC: 'metric',
  IMPERIAL: 'imperial'
};

const metricPreset = [
  ['1:10', new Scale([[1, 'mm'], [10, 'mm']])],
  ['1:20', new Scale([[1, 'mm'], [20, 'mm']])],
  ['1:50', new Scale([[1, 'mm'], [50, 'mm']])],
  ['1:100', new Scale([[1, 'mm'], [100, 'mm']])],
  ['1:200', new Scale([[1, 'mm'], [200, 'mm']])],
  ['1:500', new Scale([[1, 'mm'], [500, 'mm']])],
  ['1:1000', new Scale([[1, 'mm'], [1000, 'mm']])]
];
const imperialPreset = [
  ['1/16"=1\'-0"', new Scale([[1 / 16, 'in'], [1, 'ft-in']])],
  ['3/32"=1\'-0"', new Scale([[3 / 32, 'in'], [1, 'ft-in']])],
  ['1/8"=1\'-0"', new Scale([[1 / 8, 'in'], [1, 'ft-in']])],
  ['3/16"=1\'-0"', new Scale([[3 / 16, 'in'], [1, 'ft-in']])],
  ['1/4"=1\'-0"', new Scale([[1 / 4, 'in'], [1, 'ft-in']])],
  ['3/8"=1\'-0"', new Scale([[3 / 8, 'in'], [1, 'ft-in']])],
  ['1/2"=1\'-0"', new Scale([[1 / 2, 'in'], [1, 'ft-in']])],
  ['3/4"=1\'-0"', new Scale([[3 / 4, 'in'], [1, 'ft-in']])],
  ['1"=1\'-0"', new Scale([[1, 'in'], [1, 'ft-in']])]
];

export const getMeasurementScalePreset = () => ({
  [PresetMeasurementSystems.METRIC]: metricPreset,
  [PresetMeasurementSystems.IMPERIAL]: imperialPreset
});

const decimalPrecisions = [
  ['0.1', 0.1],
  ['0.01', 0.01],
  ['0.001', 0.001],
  ['0.0001', 0.0001]
];
const fractionalPrecisions = [
  ['1/8', 0.125],
  ['1/16', 0.0625],
  ['1/32', 0.03125],
  ['1/64', 0.015625]
];
export const PrecisionType = {
  DECIMAL: 'decimal',
  FRACTIONAL: 'fractional'
};
export const precisionOptions = {
  [PrecisionType.DECIMAL]: decimalPrecisions,
  [PrecisionType.FRACTIONAL]: fractionalPrecisions
};

export const precisionFractions = {
  0.125: '1/8',
  0.0625: '1/16',
  0.03125: '1/32',
  0.015625: '1/64'
};

export const numberRegex = /^\d*(\.\d*)?$/;
export const fractionRegex = /^\d*(\s\d\/\d*)$/;
export const pureFractionRegex = /^(\d\/\d*)*$/;
export const scaleRegex = /(\d+(?:.\d+)?\s\w+)\W+(\d+(?:.\d+)?\s\w+)/;
export const floatRegex = /^(\d+)?(\.)?(\d+)?$/;
export const inFractionalRegex = /^((\d+) )?((\d+)\/)?(\d+)"$/;
export const ftInFractionalRegex = /^((\d+)'-)?((\d+) )?((\d+)\/)?(\d+)"$/;
export const ftInDecimalRegex = /^((\d+)ft-)?(((\d+).)?(\d+))in$/;

export const parseFtInDecimal = (valueStr) => {
  const matches = valueStr.match(ftInDecimalRegex);
  let sum = 0;
  sum += matches[2] ? Number(matches[2]) : 0;
  if (matches[3] && Number(matches[3])) {
    sum += (Number(matches[3]) / 12);
  }
  return sum;
};
export const parseInFractional = (valueStr) => {
  const matches = valueStr.match(inFractionalRegex);
  let sum = 0;
  sum += matches[2] ? Number(matches[2]) : 0;
  if (matches[5] && Number(matches[5])) {
    if (matches[4] && Number(matches[4])) {
      sum += (Number(matches[4]) / Number(matches[5]));
    } else {
      sum += Number(matches[5]);
    }
  }
  return sum;
};
export const parseFtInFractional = (valueStr) => {
  const matches = valueStr.match(ftInFractionalRegex);
  let sum = 0;
  sum += matches[2] ? Number(matches[2]) : 0;
  sum += matches[4] ? Number(matches[4]) / 12 : 0;
  if (matches[7] && Number(matches[7])) {
    if (matches[6] && Number(matches[6])) {
      sum += (Number(matches[6]) / Number(matches[7])) / 12;
    } else {
      sum += Number(matches[7]) / 12;
    }
  }
  return sum;
};

export const fractionalUnits = ['in', 'ft-in'];
export const metricUnits = ['mm', 'cm', 'm', 'km'];

export const ifFractionalPrecision = (precision) => fractionalPrecisions.map((item) => item[0]).includes(precision) || fractionalPrecisions.map((item) => item[1]).includes(precision);

export const hintValues = {
  'in': 'eg. 1 1/2"',
  'ft-in': 'eg. 1\'-1 1/2"',
  'ft-in decimal': 'eg. 1ft-10.5in'
};

// the base unit is cm
const unitConversion = {
  'mm': 0.1,
  'cm': 1,
  'm': 100,
  'km': 100000,
  'mi': 160394,
  'yd': 91.44,
  'ft': 30.48,
  'in': 2.54,
  'ft\'': 30.48,
  'in"': 2.54,
  'pt': 0.0352778,
  'ft-in': 30.48
};

export const convertUnit = (value, unit, newUnit) => {
  return value * unitConversion[unit] / unitConversion[newUnit];
};

export const scalePresetPrecision = {
  [imperialPreset[0][0]]: fractionalPrecisions[1],
  [imperialPreset[1][0]]: fractionalPrecisions[2],
  [imperialPreset[2][0]]: fractionalPrecisions[0],
  [imperialPreset[3][0]]: fractionalPrecisions[1],
  [imperialPreset[4][0]]: fractionalPrecisions[0],
  [imperialPreset[5][0]]: fractionalPrecisions[0],
  [imperialPreset[6][0]]: fractionalPrecisions[0],
  [imperialPreset[7][0]]: fractionalPrecisions[0],
  [imperialPreset[8][0]]: fractionalPrecisions[0]
};

export const initialScale = new Scale({ pageScale: { value: 1, unit: 'in' }, worldScale: { value: 1, unit: 'in' } });
