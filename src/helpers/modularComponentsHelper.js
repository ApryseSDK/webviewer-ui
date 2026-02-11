export const addDataElementFromKey = (map) => {
  return Object.fromEntries(
    Object.entries(map).map(([key, value]) => {
      const entry = value || {};
      return [key, { ...entry, dataElement: entry.dataElement || key }];
    })
  );
};
