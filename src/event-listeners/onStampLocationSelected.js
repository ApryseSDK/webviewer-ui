import core from 'core';
// import { isTabletOrMobile } from 'helpers/device';
// import actions from 'actions';
// import selectors from 'selectors';

export default store => () => {
  console.log('%c onStampLocationSelected ', 'background: yellow; color: black;');
  const stampTool = core.getTool('AnnotationCreateRubberStamp');

  if (!stampTool.isEmptyStamp()) {
    stampTool.addStamp();
  }
};
