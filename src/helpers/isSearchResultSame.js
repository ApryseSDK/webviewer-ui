// Currently there is no unique id with search result. To match if 2 results are same
// we check first that they are on same page and then if their coordinates match,
// then they are considered to be same result
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
  if (quadA.x1 === quadB.x1 &&
    quadA.x2 === quadB.x2 &&
    quadA.x3 === quadB.x3 &&
    quadA.x4 === quadB.x4 &&
    quadA.y1 === quadB.y1 &&
    quadA.y2 === quadB.y2 &&
    quadA.y3 === quadB.y3 &&
    quadA.y4 === quadB.y4) {
    return true;
  }
  return false;
}

export default isSearchResultSame;
