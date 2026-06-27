const Scale = window.Core.Scale;

// Keep key names aligned with core MeasurementUnits
export const Units = Object.freeze({
  MM: 'mm',
  CM: 'cm',
  M: 'm',
  KM: 'km',
  MI: 'mi',
  YD: 'yd',
  FT: 'ft',
  IN: 'in',
  FT_IN: 'ft-in',
  PRIME_FT: 'ft\'',
  DOUBLE_PRIME_IN: 'in"',
  PT: 'pt'
});

export const UnitGroups = Object.freeze({
  FRACTIONAL: Object.freeze([Units.IN, Units.FT_IN]),
  METRIC: Object.freeze([Units.MM, Units.CM, Units.M, Units.KM])
});

export const HintKeys = Object.freeze({
  FT_IN_DECIMAL: 'ft-in decimal'
});

export const PresetMeasurementSystems = {
  METRIC: 'metric',
  IMPERIAL: 'imperial'
};

const metricPreset = [
  ['1:10', new Scale([[1, Units.MM], [10, Units.MM]])],
  ['1:20', new Scale([[1, Units.MM], [20, Units.MM]])],
  ['1:50', new Scale([[1, Units.MM], [50, Units.MM]])],
  ['1:100', new Scale([[1, Units.MM], [100, Units.MM]])],
  ['1:200', new Scale([[1, Units.MM], [200, Units.MM]])],
  ['1:500', new Scale([[1, Units.MM], [500, Units.MM]])],
  ['1:1000', new Scale([[1, Units.MM], [1000, Units.MM]])]
];
const imperialPreset = [
  ['1/16"=1\'-0"', new Scale([[1 / 16, Units.IN], [1, Units.FT_IN]])],
  ['3/32"=1\'-0"', new Scale([[3 / 32, Units.IN], [1, Units.FT_IN]])],
  ['1/8"=1\'-0"', new Scale([[1 / 8, Units.IN], [1, Units.FT_IN]])],
  ['3/16"=1\'-0"', new Scale([[3 / 16, Units.IN], [1, Units.FT_IN]])],
  ['1/4"=1\'-0"', new Scale([[1 / 4, Units.IN], [1, Units.FT_IN]])],
  ['3/8"=1\'-0"', new Scale([[3 / 8, Units.IN], [1, Units.FT_IN]])],
  ['1/2"=1\'-0"', new Scale([[1 / 2, Units.IN], [1, Units.FT_IN]])],
  ['3/4"=1\'-0"', new Scale([[3 / 4, Units.IN], [1, Units.FT_IN]])],
  ['1"=1\'-0"', new Scale([[1, Units.IN], [1, Units.FT_IN]])]
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

export const fractionalUnits = UnitGroups.FRACTIONAL;
export const metricUnits = UnitGroups.METRIC;

export const ifFractionalPrecision = (precision) => fractionalPrecisions.map((item) => item[0]).includes(precision) || fractionalPrecisions.map((item) => item[1]).includes(precision);

export const hintValues = {
  [Units.IN]: 'eg. 1 1/2"',
  [Units.FT_IN]: 'eg. 1\'-1 1/2"',
  [HintKeys.FT_IN_DECIMAL]: 'eg. 1ft-10.5in'
};

// the base unit is cm
const unitConversion = {
  [Units.MM]: 0.1,
  [Units.CM]: 1,
  [Units.M]: 100,
  [Units.KM]: 100000,
  [Units.MI]: 160394,
  [Units.YD]: 91.44,
  [Units.FT]: 30.48,
  [Units.IN]: 2.54,
  [Units.PRIME_FT]: 30.48,
  [Units.DOUBLE_PRIME_IN]: 2.54,
  [Units.PT]: 2.54 / 72,
  [Units.FT_IN]: 30.48
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

export const initialScale = new Scale({ pageScale: { value: 1, unit: Units.IN }, worldScale: { value: 1, unit: Units.IN } });
