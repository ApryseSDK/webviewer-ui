const getSpreadsheetCustomDataInt = (annotation, key) => Number.parseInt(annotation.getCustomData(key), 10) || 0;

export default getSpreadsheetCustomDataInt;