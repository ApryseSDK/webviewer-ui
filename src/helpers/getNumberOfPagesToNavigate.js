export default displayMode => {
  const mapDisplayModeToNumberOfPages = {
    Single: 1,
    Continuous: 1,
    Facing: 2,
    FacingContinuous: 2,
    CoverFacing: 2,
    Cover: 2,
  };

  return mapDisplayModeToNumberOfPages[displayMode];
};
