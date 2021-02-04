export default () => async(/* widget */) => {
  if (!window.CoreControls.isFullPDFEnabled()) {
    return;
  }

  await window.PDFNet.initialize(undefined, 'ems');

  // const pdfDoc = await window.docViewer.getDocument().getPDFDoc();
  // const fieldName = widget.getField().name;
  // const field = await pdfDoc.getDigitalSignatureField(fieldName);
  /**
   * @todo Originally implementated for the Digital Signature Validation Modal?
   *
   * https://github.com/PDFTron/webviewer-ui/blob/2cbf53f21a89f096284bc2902577ff86b58c75e1/src/event-listeners/onDigitalSignatureAvailable.js
   *
   * Still requires a return value.
   */
};
