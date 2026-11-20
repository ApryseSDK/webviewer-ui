export const parseRecordId = (value) => {
  if (!value) {
    return null;
  }
  const id = Number(value);
  if (Number.isNaN(id)) {
    console.warn(`Invalid annotation id value: ${value}`);
    return null;
  }

  return id;
};
