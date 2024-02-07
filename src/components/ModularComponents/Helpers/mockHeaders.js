/* eslint-disable no-alert */
const baseButton = {
  dataElement: 'button',
  onClick: () => alert('Added'),
  disabled: false,
  title: 'Button 1',
  label: 'Add',
  type: 'customButton'
};

const divider = {
  type: 'divider',
  dataElement: 'divider-1',
};

const leftPanelToggle = {
  dataElement: 'leftPanelToggle',
  toggleElement: 'leftPanel',
  disabled: false,
  title: 'Left Panel',
  img: 'icon-header-sidebar-line',
  type: 'toggleButton',
};

const notesPanelToggle = {
  dataElement: 'notesPanelToggle',
  toggleElement: 'notesPanel',
  disabled: false,
  title: 'Notes Panel',
  img: 'icon-header-chat-line',
  type: 'toggleButton',
};

// Handy mock buttons
const button1 = { ...baseButton, dataElement: 'button1', label: 'Button 1' };
const button2 = { ...baseButton, dataElement: 'button2', label: 'Button 2' };
const button3 = { ...baseButton, dataElement: 'button3', label: 'Button 3' };
const button4 = { ...baseButton, dataElement: 'button4', label: 'Button 4' };
const button5 = { ...baseButton, dataElement: 'button5', label: 'Button 5' };
const button6 = { ...baseButton, dataElement: 'button6', label: 'Button 6' };
const button7 = { ...baseButton, dataElement: 'button7', label: 'Button 7' };
const button8 = { ...baseButton, dataElement: 'button8', label: 'Button 8' };
const button9 = { ...baseButton, dataElement: 'button9', label: 'Button 9' };

// These are our headers
const defaultTopHeader = {
  dataElement: 'defaultHeader',
  placement: 'top',
  gap: 20,
  items: ['button1', 'button2', 'divider', 'button3'],
};

const floatStartHeader = {
  dataElement: 'floatStartHeader',
  placement: 'top',
  float: true,
  position: 'start',
  items: ['button1', 'button2'],
  gap: 20
};

const secondFloatStartHeader = {
  dataElement: 'floatStartHeader-2',
  placement: 'top',
  float: true,
  position: 'start',
  items: ['button3', 'button4'],
  gap: 20
};

const floatCenterHeader = {
  dataElement: 'floatCenterHeader',
  placement: 'top',
  float: true,
  position: 'center',
  items: ['button5', 'divider', 'button6'],
  gap: 20
};

const floatEndHeader = {
  dataElement: 'floatEndHeader',
  placement: 'top',
  float: true,
  position: 'end',
  items: ['button7', 'divider', 'button8', 'button9'],
  gap: 20
};

const defaultLeftHeader = {
  dataElement: 'defaultHeader',
  placement: 'left',
  gap: 20,
  items: ['button1', 'button2', 'divider', 'button3'],
};

const floatStartLeftHeader = {
  dataElement: 'floatStartLeftHeader',
  placement: 'left',
  float: true,
  position: 'start',
  items: ['button3', 'button4', 'leftPanelToggle'],
  gap: 20
};

const secondFloatStartLeftHeader = {
  dataElement: 'secondFloatLeftBottomHeader',
  placement: 'left',
  float: true,
  position: 'start',
  items: ['button5', 'button6'],
  gap: 20
};

const floatCenterLeftHeader = {
  dataElement: 'floatCenterLeftHeader',
  placement: 'left',
  float: true,
  position: 'center',
  items: ['button1', 'button2'],
  gap: 20
};

const floatEndLeftHeader = {
  dataElement: 'floatEndLeftHeader',
  placement: 'left',
  float: true,
  position: 'end',
  items: ['button7', 'button8', 'divider', 'button9'],
  gap: 20
};

const defaultRightHeader = {
  dataElement: 'defaultHeader',
  placement: 'right',
  gap: 20,
  items: ['button1', 'button2', 'divider', 'button3'],
};

const floatStartRightHeader = {
  dataElement: 'floatStartRightHeader',
  placement: 'right',
  float: true,
  position: 'start',
  items: ['button3', 'button4', 'notesPanelToggle'],
  gap: 20
};

const secondFloatStartRightHeader = {
  dataElement: 'secondFloatRightBottomHeader',
  placement: 'right',
  float: true,
  position: 'start',
  items: ['button5', 'button6'],
  gap: 20
};

const floatCenterRightHeader = {
  dataElement: 'floatCenterRightHeader',
  placement: 'right',
  float: true,
  position: 'center',
  items: ['button1', 'button2'],
  gap: 20
};

const floatEndRightHeader = {
  dataElement: 'floatEndRightHeader',
  placement: 'right',
  float: true,
  position: 'end',
  items: ['button7', 'button8', 'divider', 'button9'],
  gap: 20
};

const defaultBottomHeader = {
  dataElement: 'defaultBottomHeader',
  placement: 'bottom',
  gap: 20,
  items: ['button1', 'button2', 'divider', 'button3'],
  getDimensionTotal: () => {
    return 32;
  }
};

const floatStartBottomHeader = {
  dataElement: 'floatStartBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'start',
  items: ['button3', 'button4'],
  gap: 20
};

const secondFloatStartBottomHeader = {
  dataElement: 'secondFloatStartBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'start',
  items: ['button5', 'button6'],
  gap: 20
};

const floatCenterBottomHeader = {
  dataElement: 'floatCenterBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'center',
  items: ['button1', 'button2'],
  gap: 20
};

const floatEndBottomHeader = {
  dataElement: 'floatEndBottomHeader',
  placement: 'bottom',
  float: true,
  position: 'end',
  items: ['button7', 'button8', 'divider', 'button9'],
  gap: 20
};

const floatStarTopHeaderStatic = {
  dataElement: 'floatStarTopHeaderStatic',
  placement: 'top',
  float: true,
  position: 'start',
  items: ['button1', 'button2'],
  opacityMode: 'static',
  opacity: 'full',
};

const floatCenterTopHeaderDynamic = {
  dataElement: 'floatStarTopHeaderDynamic',
  placement: 'top',
  float: true,
  position: 'center',
  items: ['button1', 'button2'],
  opacityMode: 'dynamic',
  opacity: 'low',
};

const floatEndTopHeaderNone = {
  dataElement: 'floatStarTopHeaderNone',
  placement: 'top',
  float: true,
  position: 'end',
  items: ['button1', 'button2'],
  opacityMode: 'dynamic',
  opacity: 'none',
};

const mockModularComponents = {
  'button1': button1,
  'button2': button2,
  'button3': button3,
  'button4': button4,
  'button5': button5,
  'button6': button6,
  'button7': button7,
  'button8': button8,
  'button9': button9,
  'divider': divider,
  'leftPanelToggle': leftPanelToggle,
  'notesPanelToggle': notesPanelToggle,
};

export {
  button1,
  button2,
  button3,
  button4,
  button5,
  button6,
  button7,
  button8,
  button9,
  defaultTopHeader,
  floatStartHeader,
  secondFloatStartHeader,
  floatCenterHeader,
  floatEndHeader,
  defaultLeftHeader,
  floatStartLeftHeader,
  secondFloatStartLeftHeader,
  floatCenterLeftHeader,
  floatEndLeftHeader,
  defaultRightHeader,
  floatStartRightHeader,
  secondFloatStartRightHeader,
  floatCenterRightHeader,
  floatEndRightHeader,
  defaultBottomHeader,
  floatStartBottomHeader,
  secondFloatStartBottomHeader,
  floatCenterBottomHeader,
  floatEndBottomHeader,
  floatStarTopHeaderStatic,
  floatCenterTopHeaderDynamic,
  floatEndTopHeaderNone,
  // Modular stuff
  mockModularComponents,
};