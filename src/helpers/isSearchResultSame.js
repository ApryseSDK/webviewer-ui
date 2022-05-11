// Currently there is no unique id with search result. To match if 2 results are same
// we check first that they are on same page and then if their coordinates match,
// then they are considered to be same result

function getQuadCoordinates(quad) {
  // if quads passed are Quad classes, then our minification changes the property names
  // here we first check if coordnates have the correct props, we use those. if not then we
  // will call getPoints() function which returns coordinates as JS object.
  /* eslint-disable eqeqeq */
  // purposefully check for null and undefined
  if (quad.x1 != undefined
    && quad.x2 != undefined
    && quad.x3 != undefined
    && quad.x4 != undefined
    && quad.y1 != undefined
    && quad.y2 != undefined
    && quad.y3 != undefined
    && quad.y4 != undefined) {
    /* eslint-enable eqeqeq */
    return quad;
  }

  if (quad.getPoints) {
    return quad.getPoints();
  }
}
function isSearchResultSame(searchResultA, searchResultB) {
  if (!searchResultA || !searchResultB) {
    return false;
  }
  const isOnSamePage = searchResultA.pageNum === searchResultB.pageNum;
  if (!isOnSamePage) {
    return false;
  }
  const quadA = searchResultA.quads[0];
  const quadB = searchResultB.quads[0];
  if (!quadA || !quadB) {
    return false;
  }
  const quadACoordinates = getQuadCoordinates(quadA);
  const quadBCoordinates = getQuadCoordinates(quadB);
  // if we get coordinates correctly from quad then we use those
  if (quadACoordinates && quadBCoordinates) {
    if (
      quadACoordinates.x1 === quadBCoordinates.x1 &&
      quadACoordinates.x2 === quadBCoordinates.x2 &&
      quadACoordinates.x3 === quadBCoordinates.x3 &&
      quadACoordinates.x4 === quadBCoordinates.x4 &&
      quadACoordinates.y1 === quadBCoordinates.y1 &&
      quadACoordinates.y2 === quadBCoordinates.y2 &&
      quadACoordinates.y3 === quadBCoordinates.y3 &&
      quadACoordinates.y4 === quadBCoordinates.y4
    ) {
      return true;
    }
  } else {
    // if we didn't get the coordinates, we use previous implementation of comparing values as string
    // this has few problems. If quad has other values than x1, x2... those will be included as well.
    // The other issue is that Object.values() doesn't guarantee order of values and in case values are in different
    // order this wont work. Thus we have proper implementation above and fallback to older implementation if it fails
    return Object.values(quadA).toString() === Object.values(quadB).toString();
  }
  return false;
}

export default isSearchResultSame;
