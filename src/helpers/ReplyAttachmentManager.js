import core from 'core';

const icons = {
  pdf: 'ic-file-pdf',
  image: 'ic-file-img',
  cad: 'ic-file-cad',
  doc: 'ic-file-doc',
  ppt: 'ic-file-ppt',
  xls: 'ic-file-xls',
  unknown: 'ic-file-etc'
};

const FileAttachmentUtils = window.Annotations.FileAttachmentUtils;

export async function decompressFileContent(file) {
  return FileAttachmentUtils.decompressWithFlateDecode(file.content, file.type);
}

export async function setAnnotationAttachments(annotation, files = []) {
  await annotation.setAttachments(files);
  core.getAnnotationManager().trigger('annotationChanged', [[annotation], 'modify', {}]);
}

export function isImage(file) {
  if (file.type && file.type.startsWith('image/')) {
    return true;
  }
  return false;
}

export function getAttachmentIcon(file) {
  if (isImage(file)) {
    return icons.image;
  }
  const extension = file.name?.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return icons.pdf;
    case 'cad':
      return icons.cad;
    case 'doc':
    case 'docx':
      return icons.doc;
    case 'ppt':
    case 'pptx':
      return icons.ppt;
    case 'xls':
    case 'xlsx':
      return icons.xls;
    default:
      return icons.unknown;
  }
}
