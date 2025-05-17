/**
 * Create a context from the OCGConfig provided by the PDFDoc
 * @param {window.Core.PDFNet.PDFDoc} pdfDoc PDFDoc of document
 * @returns {window.Core.PDFNet.OCGContext} context object
 * @ignore
 */
const createContextFromOCGConfig = async (pdfDoc, PDFNet) => {
  try {
    const layerConfig = await pdfDoc.getOCGConfig();
    return PDFNet.OCGContext.createFromConfig(layerConfig);
  } catch (e) {
    throw new Error(`Error creating OCGContext from PDFDoc: ${e.message}`);
  }
};

/**
 * Extracts layers from the document, by editing the PDFDoc object
 * @param {window.Core.Document} document Document object
 * @param {Array<object>} layers array of layer objects
 * @returns {window.Core.Document} layerDoc
 * @ignore
 */
export const extractLayersFromDocument = async (document, layers) => {
  const { Core } = window;
  const { PDFNet } = Core;

  try {
    const pdfDoc = await document.getPDFDoc();
    const ctx = await createContextFromOCGConfig(pdfDoc, PDFNet);

    await adjustOCPropertiesLayerVisibility(pdfDoc, layers, ctx, PDFNet);
    await removeOCGContent(pdfDoc, ctx, PDFNet);

    return createFlattenedLayerDocument(pdfDoc, Core);
  } catch (error) {
    throw new Error(`EmbeddedPrint Layers Error: ${error.message}`);
  }
};

/**
 * Adjust PDFDoc OCG properties to match the layers visibility
 * @param {PDFNet.PDFDoc} pdfDoc PDFDoc of document
 * @param {Array<object>} layers array of layer objects
 * @param {PDFNet.OCGContext} ocContext context object
 * @ignore
 */
const adjustOCPropertiesLayerVisibility = async (pdfDoc, layers, ocContext, PDFNet) => {
  const layersVisibleMap = createLayersMap(layers);
  try {
    const ocgs = await pdfDoc.getOCGs();
    const ocgsLength = await ocgs.size();

    for (let i = ocgsLength - 1; i >= 0; i--) {
      const ocg = await PDFNet.OCG.createFromObj(await ocgs.getAt(i));
      const ocgName = await ocg.getName();
      ocContext.setState(ocg, layersVisibleMap.get(ocgName));
    }
  } catch (error) {
    throw new Error(`Error adjusting OCG properties: ${error.message}`);
  }
};

/**
 * Creates a PDF document without unused layers
 * @param {PDFNet.PDFDoc} pdfDocument PDFDoc of document
 * @returns {Core.Document} layerDoc
 * @ignore
 */
const createFlattenedLayerDocument = async (pdfDocument, Core) => {
  try {
    const bufferPDFDoc = await pdfDocument.saveMemoryBuffer(window.Core.PDFNet.SDFDoc.SaveOptions.e_remove_unused);
    return Core.createDocument(bufferPDFDoc, { extension: 'pdf' });
  } catch (error) {
    throw new Error(`Error creating flattened layer document: ${error.message}`);
  }
};

/**
 * Redraw all visible layer content on the page
 * @param {PDFNet.PDFDoc} doc PDFNet doc of the document
 * @param {PDFNet.OCGContext} ctx context object on optional-content
 * @ignore
 */
const removeOCGContent = async (doc, ctx, PDFNet) => {
  let reader, writer;
  try {
    reader = await PDFNet.ElementReader.create();
    writer = await PDFNet.ElementWriter.create();

    let pageIterator = await doc.getPageIterator();
    do {
      const page = await pageIterator.current();
      await reader.beginOnPage(page, ctx);
      await writer.beginOnPage(page, PDFNet.ElementWriter.WriteMode.e_replacement, false);

      let element;
      while ((element = await reader.next())) {
        const isVisible = await element.isOCVisible();
        if (!isVisible) {
          continue;
        }
        await writer.writeElement(element);
      }

      await writer.end();
      await reader.end();
    } while (await pageIterator.hasNext() && await pageIterator.next());
  } catch (error) {
    throw new Error(`Error removing OCG content: ${error.message}`);
  } finally {
    await reader?.destroy();
    await writer?.destroy();
  }
};

/**
 * Creates a map of layers and their visibility
 * @param {Array<object>} layers array of layer objects
 * @returns {Map<string, boolean>} layersVisibleMap
 * @ignore
 */
const createLayersMap = (layers) => {
  return new Map(layers.map((layer) => [layer.name, layer.visible]));
};