export default (pt1, pt2, pt3) => {
  let angle;

  if (pt1 && pt2) {
    if (pt3) {
      // calculate the angle using Law of cosines
      const AB = Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
      const BC = Math.sqrt(Math.pow(pt2.x - pt3.x, 2) + Math.pow(pt2.y - pt3.y, 2));
      const AC = Math.sqrt(Math.pow(pt3.x - pt1.x, 2) + Math.pow(pt3.y - pt1.y, 2));
      angle = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
    } else {
      // if there are only two points returns the angle in the plane (in radians) between the positive x-axis and the ray from (0,0) to the point (x,y)
      angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
      // keep the angle range between 0 and Math.PI / 2
      angle = Math.abs(angle);
      angle = angle > Math.PI / 2 ? Math.PI - angle : angle;
    }
  }

  return angle;
};
