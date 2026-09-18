export const getSignatureColorHex = (color) => color?.toHexString?.() || color;

export const isSignatureColorAvailable = (color, signatureModalColors) => {
  const colorHex = getSignatureColorHex(color);

  return signatureModalColors.some(
    (availableColor) => availableColor.toLowerCase() === colorHex?.toLowerCase()
  );
};
