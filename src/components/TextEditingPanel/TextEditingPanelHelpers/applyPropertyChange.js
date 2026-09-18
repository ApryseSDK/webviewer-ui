const conversionMap = {
  Font: 'fontName',
  FontSize: 'fontSize',
  TextAlign: 'textAlign',
};

const applyPropertyChange = ({ instance, selectedContentBox, property, value }) => {
  if (selectedContentBox) {
    switch (property) {
      case 'Font':
        instance.Core.ContentEdit.setContentFont(selectedContentBox, value);
        break;
      case 'FontSize':
        instance.Core.ContentEdit.setContentFontSize(selectedContentBox, value);
        break;
      case 'TextAlign':
        instance.Core.ContentEdit.alignContents(selectedContentBox, value);
        return;
      default:
        return;
    }
  }

  const mappedProperty = conversionMap[property];
  if (!mappedProperty) {
    return;
  }

  instance.Core.ContentEdit.setTextAttributes({ [mappedProperty]: value });
};

export default applyPropertyChange;