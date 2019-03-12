import core from 'core';

class OrientationManager {
    getDocumentCenter = pageNumber => {
<<<<<<< HEAD
        const { width, height } = core.getPageInfo(pageNumber - 1);
=======
        const { width, height } = core.getPageInfo(pageNumber);
>>>>>>> 70c479f... [bugfix] resolves #179 (#193)

        return { x: width / 2, y: height / 2 };
    }
    getRotationRad = pageNumber => {
        const orientation = core.getRotation(pageNumber);

        const radians = (4 - orientation) * (Math.PI / 2);

        return radians;
    }
    getRotationDeg = pageNumber => {
        const orientation = core.getRotation(pageNumber);

        const degrees = (4 - orientation) * 90;

        return degrees;
    }
}

export default new OrientationManager();
