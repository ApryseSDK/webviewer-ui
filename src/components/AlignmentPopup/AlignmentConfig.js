import core from 'core';

const annotationManager = core.getAnnotationManager();

const { LEFT, RIGHT, TOP, BOTTOM } = annotationManager.Alignment.StandardAlignmentTypes;
const { CENTER_VERTICAL, CENTER_HORIZONTAL } = annotationManager.Alignment.CenterAlignmentTypes;
const { DISTRIBUTE_VERTICAL, DISTRIBUTE_HORIZONTAL } = annotationManager.Alignment.DistributeAlignmentTypes;

const alignmentConfig = [
  {
    alignment: LEFT,
    icon: 'ic-alignment-left',
    title: 'alignmentPopup.alignLeft',
  },
  {
    alignment: CENTER_HORIZONTAL,
    icon: 'ic-alignment-center-horizontal',
    title: 'alignmentPopup.alignHorizontalCenter',
  },
  {
    alignment: RIGHT,
    icon: 'ic-alignment-right',
    title: 'alignmentPopup.alignRight',
  },
  {
    alignment: TOP,
    icon: 'ic-alignment-top',
    title: 'alignmentPopup.alignTop',
  },
  {
    alignment: CENTER_VERTICAL,
    icon: 'ic-alignment-center-vertical',
    title: 'alignmentPopup.alignVerticalCenter',
  },
  {
    alignment: BOTTOM,
    icon: 'ic-alignment-bottom',
    title: 'alignmentPopup.alignBottom',
  }
];

const distributeConfig = [
  {
    alignment: DISTRIBUTE_VERTICAL,
    icon: 'ic-distribute-vertical',
    title: 'alignmentPopup.distributeVertical',
  },
  {
    alignment: DISTRIBUTE_HORIZONTAL,
    icon: 'ic-distribute-horizontal',
    title: 'alignmentPopup.distributeHorizontal',
  }
];

export {
  alignmentConfig,
  distributeConfig
};