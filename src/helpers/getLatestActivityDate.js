export default annotation => {
  const latestDate = annotation.getReplies().reduce((result, reply) => {
    if (reply.DateModified === null || new Date(result) > new Date(reply.DateModified)) {
      return result;
    } else {
      return reply.DateModified;
    }
  }, annotation.DateModified);
  
  return latestDate ? latestDate : new Date();
};
