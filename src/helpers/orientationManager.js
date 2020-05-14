import core from 'core';

class OrientationManager {
  getDocumentCenter = pageNumber => {
    let result;
    if (pageNumber <= core.getTotalPages()) {
      result = core.getPageInfo(pageNumber);
    } else {
      result = {
        width: 0,
        height: 0,
      };
    }
    return { x: result.width / 2, y: result.height / 2 };
  };

  getRotationRad = pageNumber => {
    const orientation = core.getRotation(pageNumber);

    const radians = (4 - orientation) * (Math.PI / 2);

    return radians;
  };

  getRotationDeg = pageNumber => {
    const orientation = core.getRotation(pageNumber);

    const degrees = (4 - orientation) * 90;

    return degrees;
  };
}

export default new OrientationManager();
