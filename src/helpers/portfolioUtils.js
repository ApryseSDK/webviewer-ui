export const hasChildren = (portfolioItem) => {
  return portfolioItem?.children?.length > 0;
};

export const isOpenableFile = (portfolioItem) => {
  const extensionRegExp = /(?:\.([^.?]+))?$/;
  const extension = extensionRegExp.exec(portfolioItem.name)[1];
  return ['pdf', 'doc', 'docx', 'xod'].includes(extension);
};