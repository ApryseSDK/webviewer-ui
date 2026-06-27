function normalizeInitialEditMode(mode, validModes, missingModeFallback, invalidModeFallback = missingModeFallback) {
  if (!mode) {
    return missingModeFallback;
  }

  if (validModes.includes(mode)) {
    return mode;
  }

  console.warn(`Invalid initialEditMode parameter: ${mode}. Default to Editing mode.`);
  return invalidModeFallback;
}

export default normalizeInitialEditMode;