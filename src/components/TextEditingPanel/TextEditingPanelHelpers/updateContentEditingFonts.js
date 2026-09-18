/**
 * Fetches the content-editing fonts supported by the current document and merges
 * any newly discovered fonts into the existing font list. Falls back to an empty
 * list if the fonts lookup resolves null/undefined.
 * @param {Object} params
 * @param {Object} params.instance The WebViewer instance.
 * @param {Function} params.setFonts React state setter for the fonts list.
 * @returns {Promise<void>}
 * @ignore
 */
const updateContentEditingFonts = async ({ instance, setFonts }) => {
  const supportedFonts = (await instance.Core.ContentEdit.getContentEditingFonts()) ?? [];

  setFonts((prevFonts) => [
    ...prevFonts,
    ...supportedFonts.filter((font) => !prevFonts.includes(font)),
  ]);
};

export default updateContentEditingFonts;
