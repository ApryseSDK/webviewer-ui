export default CSSFile => {
  if (CSSFile) {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = CSSFile;

    document.getElementsByTagName('head')[0].appendChild(link);
  }
};