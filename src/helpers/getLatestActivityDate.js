export default annotation => {
  const latestReplyActivityDate = annotation.getReplies().reduce((acc, reply) => {
    const replyDate = reply.DateModified || reply.DateCreated;
    if (replyDate && new Date(replyDate) > new Date(acc)) {
      return replyDate;
    } else {
      return acc;
    }
  }, 0);

  if (latestReplyActivityDate) {
    return latestReplyActivityDate;
  } else if (annotation.DateModified) {
    return annotation.DateModified;
  } else if (annotation.DateCreated) {
    return annotation.DateCreated;
  }
  return new Date();
};
