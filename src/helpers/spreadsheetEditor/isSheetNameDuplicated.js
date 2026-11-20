/**
 * @ignore
 * Check if a sheet name is duplicated among other sheets (case-insensitive).
 * @param {Array} sheets
 * @param {Object} currentSheet
 * @param {string} newName
 * @returns {boolean}
 */
export const isSheetNameDuplicated = (sheets, currentSheet, newName) => {
  const newNameLowerCase = newName.toLowerCase();
  return sheets.some((sheet) =>
    sheet.name.toLowerCase() === newNameLowerCase &&
    sheet.sheetIndex !== currentSheet.sheetIndex
  );
};

export default isSheetNameDuplicated;
