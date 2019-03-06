// TODO: add documentation for this helper function
export default paths => {
  const newPaths = [];
  for (let i = 0; i < paths.length; i++) {
    newPaths.push([]);
  }

  for (let i = 0; i < paths.length; i++) {
    for (let j = 0; j < paths[i].length; j++) {
      newPaths[i][j] = new Annotations.Point(paths[i][j]['x'], paths[i][j]['y']);
    }
  }

  return newPaths;
};
