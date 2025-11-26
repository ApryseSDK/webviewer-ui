/* eslint-disable custom/no-hex-colors */
const initialColors = [
  '#e44234',
  '#ff8d00',
  '#ffcd45',
  '#5cc96e',
  '#25d2d1',
  '#597ce2',
  '#c544ce',
  '#7d2e25',
  '#a84f1d',
  '#e99e38',
  '#347842',
  '#167e7d',
  '#354a87',
  '#76287b',
  '#ffffff',
  '#cdcdcd',
  '#9c9c9c',
  '#696969',
  '#272727',
  '#000000'
];

const initialTextColors = [
  '#000000',
  '#272727',
  '#696969',
  '#9c9c9c',
  '#cdcdcd',
  '#ffffff',
  '#7d2e25',
  '#a84f1d',
  '#e99e38',
  '#347842',
  '#167e7d',
  '#354a87',
  '#76287b',
  '#e44234',
  '#ff8d00',
  '#ffcd45',
  '#5cc96e',
  '#25d2d1',
  '#597ce2',
  '#c544ce'
];
const defaultBackgroundColor = '#FFFFFF00'; // White transparent hex
const defaultTextColor = '#000000'; // Default text color
const defaultBorderColor = '#000000';
/* eslint-enable custom/no-hex-colors */

const defaultCellStyle = {
  verticalAlignment: 2,
  horizontalAlignment: 1,
  wrapText: 3,
  font: {
    fontFace: 'Arial',
    pointSize: 8,
    bold: false,
    italic: false,
    underline: false,
    strikeout: false,
    color: defaultTextColor
  },
  backgroundColor: null,
  getCellBorder: () => ({})
};

export {
  initialColors,
  initialTextColors,
  defaultBackgroundColor,
  defaultTextColor,
  defaultBorderColor,
  defaultCellStyle,
};