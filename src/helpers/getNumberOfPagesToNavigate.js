export default displayMode => {
  const mapDisplayModeToNumberOfPages = {
    Single: 1,
    Facing: 2,
    CoverFacing: 2,
  };

  return mapDisplayModeToNumberOfPages[displayMode];
};
