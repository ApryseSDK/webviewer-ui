export const isSheetNameDuplicated = (sheets, currentSheet, newName) => {
  const newNameLowerCase = newName.toLowerCase();
  return sheets.some((sheet) =>
    sheet.name.toLowerCase() === newNameLowerCase &&
    sheet.sheetIndex !== currentSheet.sheetIndex
  );
};