
const indexOfHeaderItem = (header, itemDataElement) => {
  let itemIndex = -1;
  header['items'].forEach((element, index) => {
    const item = element.props || element;
    if (item['dataElement'] === itemDataElement) {
      itemIndex = index;
    }
  });
  return itemIndex;
};

export {
  indexOfHeaderItem
};