export default () => {
  window.addEventListener('error', e => {
    const { src } = e.target;
    
    if (!src) {
      // in Safari, an error occurred in web workers will also trigger this event
      // since we handle worker error in loaderror event, we just return here
      return;
    }

    if (src.endsWith('nmf')) {
      testMIMEType(['nmf']);
    }
    if (src.endsWith('pexe')) {
      testMIMEType(['pexe']);
    }
  }, true);

  window.addEventListener('loaderror', e => {
    if (missFilesToLoad(e)) {
      testMIMEType(['res', 'mem', 'wasm', 'xod']);
    }
  });
};

const testMIMEType = fileExtensions => {
  fileExtensions.forEach(extension => {
    fetch(`./mime/dummy.${extension}`)
      .then(({ status }) => {
        if (status === 404) {
          console.error(`.${extension} mime type is not supported on your server, check https://www.pdftron.com/documentation/web/guides/basics/troubleshooting-document-loading/#mime-types`);
        }
      });
  });
};

const missFilesToLoad = ({ detail }) => {
  return detail === `Couldn't fetch resource file.` 
      || detail === 'The worker has encountered an error';
};
