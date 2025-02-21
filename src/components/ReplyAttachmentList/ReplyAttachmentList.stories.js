import React from 'react';
import ReplyAttachmentList from './ReplyAttachmentList';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default {
  title: 'Components/ReplyAttachmentList',
  component: ReplyAttachmentList
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    replyAttachmentPreviewEnabled: true,
  }
};
function rootReducer(state = initialState, action) {
  return state;
}
const store = createStore(rootReducer);

const files = [
  {
    name: 'file_1.pdf'
  },
  {
    name: 'file_2.doc'
  },
  {
    name: 'file_3_extra_long_file_name.cad'
  }
];

// State 1
export function DisplayMode() {
  const props = {
    files,
    isEditing: false
  };

  return (
    <Provider store={store}>
      <div style={{ width: '200px' }}>
        <ReplyAttachmentList {...props} />
      </div>
    </Provider>
  );
}

// State 2
export function EditMode() {
  const props = {
    files,
    isEditing: true
  };

  return (
    <Provider store={store}>
      <div style={{ width: '200px' }}>
        <ReplyAttachmentList {...props} />
      </div>
    </Provider>
  );
}

const SVG_MIME_TYPE = 'image/svg+xml';
const svgString = `
  <?xml version="1.0" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
    <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
    <script type="text/javascript">
      window.location.href = 'https://apryse.com'
    </script>
  </svg>
`;
const svgBlob = new Blob([svgString], { type: SVG_MIME_TYPE });
const svgFile = new File([svgBlob], 'redirect.svg', { type: SVG_MIME_TYPE });

// State 3
export function UnsafeSVGAttachment() {
  const props = {
    files: [...files, svgFile],
    isEditing: false
  };

  return (
    <Provider store={store}>
      <div style={{ width: '200px' }}>
        <ReplyAttachmentList {...props} />
      </div>
    </Provider>
  );
}
